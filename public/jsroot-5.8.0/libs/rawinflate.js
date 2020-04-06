/*
 * $Id$
 *
 * original:
 * http://www.onicos.com/staff/iz/amuse/javascript/expert/inflate.txt
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['JSRootCore'], factory);
  } else if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(require('./JSRootCore.js'));
  } else {
    if (typeof JSROOT == 'undefined')
      throw new Error('JSROOT is not defined', 'rawinflate.js');

    if (typeof JSROOT.ZIP !== 'undefined')
      throw new Error('JSROOT.ZIP already exists', 'rawinflate.js');

    factory(JSROOT);
  }
})(function (JSROOT) {
  'use strict';

  /* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
   * Version: 1.0.0.1
   * LastModified: Dec 25 1999
   */

  /* Interface:
   * data = zip_inflate(src);
   */

  /* constant parameters */
  var zip_WSIZE = 32768, // Sliding Window size
    //    zip_STORED_BLOCK = 0,
    //    zip_STATIC_TREES = 1,
    //    zip_DYN_TREES    = 2,

    /* for inflate */
    //    zip_lbits = 9,            // bits in base literal/length lookup table
    //    zip_dbits = 6,            // bits in base distance lookup table
    //    zip_INBUFSIZ = 32768,     // Input buffer size
    //    zip_INBUF_EXTRA = 64,     // Extra buffer

    /* variables (inflate) */
    zip_slide = null,
    zip_wp, // current position in slide
    zip_fixed_tl = null, // inflate static
    zip_fixed_td, // inflate static
    zip_fixed_bl,
    zip_fixed_bd, // inflate static
    zip_bit_buf, // bit buffer
    zip_bit_len, // bits in bit buffer
    zip_method,
    zip_eof,
    zip_copy_leng,
    zip_copy_dist,
    zip_tl,
    zip_td, // literal/length and distance decoder tables
    zip_bl,
    zip_bd, // number of bits decoded by tl and td
    zip_inflate_data,
    zip_inflate_datalen,
    zip_inflate_pos,
    /* constant tables (inflate) */
    zip_MASK_BITS = new Array(
      0x0000,
      0x0001,
      0x0003,
      0x0007,
      0x000f,
      0x001f,
      0x003f,
      0x007f,
      0x00ff,
      0x01ff,
      0x03ff,
      0x07ff,
      0x0fff,
      0x1fff,
      0x3fff,
      0x7fff,
      0xffff
    ),
    // Tables for deflate from PKZIP's appnote.txt.
    zip_cplens = new Array( // Copy lengths for literal codes 257..285
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ),
    /* note: see note #13 above about the 258 in this list. */
    zip_cplext = new Array( // Extra bits for literal codes 257..285
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      99,
      99
    ), // 99==invalid
    zip_cpdist = new Array( // Copy offsets for distance codes 0..29
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577
    ),
    zip_cpdext = new Array( // Extra bits for distance codes
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13
    ),
    zip_border = new Array( // Order of the bit length code lengths
      16,
      17,
      18,
      0,
      8,
      7,
      9,
      6,
      10,
      5,
      11,
      4,
      12,
      3,
      13,
      2,
      14,
      1,
      15
    );
  /* objects (inflate) */

  var zip_HuftList = function () {
    this.next = null;
    this.list = null;
  };

  var zip_HuftNode = function () {
    this.e = 0; // number of extra bits or operation
    this.b = 0; // number of bits in this code or subcode

    // union
    this.n = 0; // literal, length base, or distance base
    this.t = null; // (zip_HuftNode) pointer to next level of table
  };

  var zip_HuftBuild = function (
    b, // code lengths in bits (all assumed <= BMAX)
    n, // number of codes (assumed <= N_MAX)
    s, // number of simple-valued codes (0..s-1)
    d, // list of base values for non-simple codes
    e, // list of extra bits for non-simple codes
    mm
  ) {
    // maximum lookup bits

    this.status = 0; // 0: success, 1: incomplete table, 2: bad input
    this.root = null; // (zip_HuftList) starting table
    this.m = 0; // maximum lookup bits, returns actual

    /* Given a list of code lengths and a maximum table size, make a set of
   tables to decode that set of codes. Return zero on success, one if
   the given code set is incomplete (the tables are still built in this
   case), two if the input is invalid (all zero length codes or an
   oversubscribed set of lengths), and three if not enough memory.
   The code with value 256 is special, and the tables are constructed
   so that no bits beyond that code are fetched when that code is
   decoded. */

    var BMAX = 16, // maximum bit length of any code
      N_MAX = 288, // maximum number of codes in any set
      c = new Array(BMAX + 1), // bit length count table
      lx = new Array(BMAX + 1), // stack of bits per table
      u = new Array(BMAX), // zip_HuftNode[BMAX][]  table stack
      v = new Array(N_MAX), // values in order of bit length
      x = new Array(BMAX + 1), // bit offsets, then code stack
      r = new zip_HuftNode(), // table entry for structure assignment
      rr = null, // temporary variable, use in assignment
      a, // counter for codes of length k
      el, // length of EOB code (value 256)
      f, // i repeats in table every f entries
      g, // maximum code length
      h, // table level
      i, // counter, current code
      j, // counter
      k, // number of bits in current code
      p, // pointer into c[], b[], or v[]
      pidx, // index of p
      q, // (zip_HuftNode) points to current table
      w,
      xp, // pointer into x or c
      y, // number of dummy codes added
      z, // number of entries in current table
      o,
      tail = (this.root = null); // (zip_HuftList)

    for (i = 0; i <= BMAX; ++i) c[i] = lx[i] = x[i] = 0;
    for (i = 0; i < BMAX; ++i) u[i] = null;
    for (i = 0; i < N_MAX; ++i) v[i] = 0;

    // Generate counts for each bit length
    el = n > 256 ? b[256] : BMAX; // set length of EOB code, if any
    p = b;
    pidx = 0;
    i = n;
    do {
      c[p[pidx++]]++; // assume all entries <= BMAX
    } while (--i > 0);

    if (c[0] == n) {
      // null input--all zero length codes
      this.root = null;
      this.m = 0;
      this.status = 0;
      return this;
    }

    // Find minimum and maximum length, bound *m by those
    for (j = 1; j <= BMAX; ++j) if (c[j] != 0) break;
    k = j; // minimum code length
    if (mm < j) mm = j;
    for (i = BMAX; i != 0; --i) if (c[i] != 0) break;
    g = i; // maximum code length
    if (mm > i) mm = i;

    // Adjust last length count to fill out codes, if needed
    for (y = 1 << j; j < i; ++j, y <<= 1) {
      if ((y -= c[j]) < 0) {
        this.status = 2; // bad input: more codes than bits
        this.m = mm;
        return this;
      }
    }
    if ((y -= c[i]) < 0) {
      this.status = 2;
      this.m = mm;
      return this;
    }
    c[i] += y;

    // Generate starting offsets into the value table for each length
    x[1] = j = 0;
    p = c;
    pidx = 1;
    xp = 2;
    while (
      --i > 0 // note that i == g from above
    )
      x[xp++] = j += p[pidx++];

    // Make a table of values in order of bit lengths
    p = b;
    pidx = 0;
    i = 0;
    do {
      if ((j = p[pidx++]) != 0) v[x[j]++] = i;
    } while (++i < n);
    n = x[g]; // set n to length of v

    // Generate the Huffman codes and for each, make the table entries
    x[0] = i = 0; // first Huffman code is zero
    p = v;
    pidx = 0; // grab values in bit order
    h = -1; // no tables yet--level -1
    w = lx[0] = 0; // no bits decoded yet
    q = null; // ditto
    z = 0; // ditto

    // go through the bit lengths (k already is bits in shortest code)
    for (; k <= g; ++k) {
      a = c[k];
      while (a-- > 0) {
        // here i is the Huffman code of length k bits for value p[pidx]
        // make tables up to required level
        while (k > w + lx[1 + h]) {
          w += lx[1 + h++]; // add bits already decoded

          // compute minimum size table less than or equal to *m bits
          z = (z = g - w) > mm ? mm : z; // upper limit
          if ((f = 1 << (j = k - w)) > a + 1) {
            // try a k-w bit table
            // too few codes for k-w bit table
            f -= a + 1; // deduct codes from patterns left
            xp = k;
            while (++j < z) {
              // try smaller tables up to z bits
              if ((f <<= 1) <= c[++xp]) break; // enough codes to use up j bits
              f -= c[xp]; // else deduct codes from patterns
            }
          }
          if (w + j > el && w < el) j = el - w; // make EOB code end at table
          z = 1 << j; // table entries for j-bit table
          lx[1 + h] = j; // set table size in stack

          // allocate and link in new table
          q = new Array(z);
          for (o = 0; o < z; ++o) {
            q[o] = new zip_HuftNode();
          }

          if (tail == null) tail = this.root = new zip_HuftList();
          else tail = tail.next = new zip_HuftList();
          tail.next = null;
          tail.list = q;
          u[h] = q; // table starts after link

          /* connect to last table, if there is one */
          if (h > 0) {
            x[h] = i; // save pattern for backing up
            r.b = lx[h]; // bits to dump before this table
            r.e = 16 + j; // bits in this table
            r.t = q; // pointer to this table
            j = (i & ((1 << w) - 1)) >> (w - lx[h]);
            rr = u[h - 1][j];
            rr.e = r.e;
            rr.b = r.b;
            rr.n = r.n;
            rr.t = r.t;
          }
        }

        // set up table entry in r
        r.b = k - w;
        if (pidx >= n) r.e = 99;
        // out of values--invalid code
        else if (p[pidx] < s) {
          r.e = p[pidx] < 256 ? 16 : 15; // 256 is end-of-block code
          r.n = p[pidx++]; // simple code is just the value
        } else {
          r.e = e[p[pidx] - s]; // non-simple--look up in lists
          r.n = d[p[pidx++] - s];
        }

        // fill code-like entries with r //
        f = 1 << (k - w);
        for (j = i >> w; j < z; j += f) {
          rr = q[j];
          rr.e = r.e;
          rr.b = r.b;
          rr.n = r.n;
          rr.t = r.t;
        }

        // backwards increment the k-bit code i
        for (j = 1 << (k - 1); (i & j) != 0; j >>= 1) i ^= j;
        i ^= j;

        // backup over finished tables
        while ((i & ((1 << w) - 1)) != x[h]) {
          w -= lx[h--]; // don't need to update q
        }
      }
    }

    /* return actual size of base table */
    this.m = lx[1];

    /* Return true (1) if we were given an incomplete table */
    this.status = y != 0 && g != 1 ? 1 : 0;
    /* end of constructor */

    return this;
  };

  /* routines (inflate) */

  var zip_NEEDBITS = function (n) {
    while (zip_bit_len < n) {
      if (zip_inflate_pos < zip_inflate_datalen)
        zip_bit_buf |= zip_inflate_data[zip_inflate_pos++] << zip_bit_len;
      zip_bit_len += 8;
    }
  };

  var zip_GETBITS = function (n) {
    return zip_bit_buf & zip_MASK_BITS[n];
  };

  var zip_DUMPBITS = function (n) {
    zip_bit_buf >>= n;
    zip_bit_len -= n;
  };

  var zip_inflate_codes = function (buff, off, size) {
    if (size == 0) return 0;

    /* inflate (decompress) the codes in a deflated (compressed) block.
      Return an error code or zero if it all goes ok. */

    var e, // table entry flag/number of extra bits
      t, // (zip_HuftNode) pointer to table entry
      n = 0;

    // inflate the coded data
    for (;;) {
      // do until end of block
      zip_NEEDBITS(zip_bl);
      t = zip_tl.list[zip_GETBITS(zip_bl)];
      e = t.e;
      while (e > 16) {
        if (e == 99) return -1;
        zip_DUMPBITS(t.b);
        e -= 16;
        zip_NEEDBITS(e);
        t = t.t[zip_GETBITS(e)];
        e = t.e;
      }
      zip_DUMPBITS(t.b);

      if (e == 16) {
        // then it's a literal
        zip_wp &= zip_WSIZE - 1;
        buff[off + n++] = zip_slide[zip_wp++] = t.n;
        if (n == size) return size;
        continue;
      }

      // exit if end of block
      if (e == 15) break;

      // it's an EOB or a length

      // get length of block to copy
      zip_NEEDBITS(e);
      zip_copy_leng = t.n + zip_GETBITS(e);
      zip_DUMPBITS(e);

      // decode distance of block to copy
      zip_NEEDBITS(zip_bd);
      t = zip_td.list[zip_GETBITS(zip_bd)];
      e = t.e;

      while (e > 16) {
        if (e == 99) return -1;
        zip_DUMPBITS(t.b);
        e -= 16;
        zip_NEEDBITS(e);
        t = t.t[zip_GETBITS(e)];
        e = t.e;
      }
      zip_DUMPBITS(t.b);
      zip_NEEDBITS(e);
      zip_copy_dist = zip_wp - t.n - zip_GETBITS(e);
      zip_DUMPBITS(e);

      // do the copy
      while (zip_copy_leng > 0 && n < size) {
        --zip_copy_leng;
        zip_copy_dist &= zip_WSIZE - 1;
        zip_wp &= zip_WSIZE - 1;
        buff[off + n++] = zip_slide[zip_wp++] = zip_slide[zip_copy_dist++];
      }

      if (n == size) return size;
    }

    zip_method = -1; // done
    return n;
  };

  var zip_inflate_stored = function (buff, off, size) {
    /* "decompress" an inflated type 0 (stored) block. */

    // go to byte boundary
    var n = zip_bit_len & 7;
    zip_DUMPBITS(n);

    // get the length and its complement
    zip_NEEDBITS(16);
    n = zip_GETBITS(16);
    zip_DUMPBITS(16);
    zip_NEEDBITS(16);
    if (n != (~zip_bit_buf & 0xffff)) return -1; // error in compressed data
    zip_DUMPBITS(16);

    // read and output the compressed data
    zip_copy_leng = n;

    n = 0;
    while (zip_copy_leng > 0 && n < size) {
      --zip_copy_leng;
      zip_wp &= zip_WSIZE - 1;
      zip_NEEDBITS(8);
      buff[off + n++] = zip_slide[zip_wp++] = zip_GETBITS(8);
      zip_DUMPBITS(8);
    }

    if (zip_copy_leng == 0) zip_method = -1; // done
    return n;
  };

  var zip_inflate_fixed = function (buff, off, size) {
    /* decompress an inflated type 1 (fixed Huffman codes) block.  We should
      either replace this with a custom decoder, or at least precompute the
      Huffman tables. */

    // if first time, set up tables for fixed blocks
    if (zip_fixed_tl == null) {
      var i = 0, // temporary variable
        l = new Array(288); // length list for huft_build

      // literal table
      while (i < 144) l[i++] = 8;
      while (i < 256) l[i++] = 9;
      while (i < 280) l[i++] = 7;
      while (i < 288) l[i++] = 8; // make a complete, but wrong code set
      zip_fixed_bl = 7;

      var h = new zip_HuftBuild(
        l,
        288,
        257,
        zip_cplens,
        zip_cplext,
        zip_fixed_bl
      );
      if (h.status != 0) {
        throw new Error('HufBuild error: ' + h.status, 'rawinflate.js');
        return -1;
      }
      zip_fixed_tl = h.root;
      zip_fixed_bl = h.m;

      // distance table
      for (i = 0; i < 30; ++i) l[i] = 5; // make an incomplete code set
      zip_fixed_bd = 5;

      h = new zip_HuftBuild(l, 30, 0, zip_cpdist, zip_cpdext, zip_fixed_bd);
      if (h.status > 1) {
        zip_fixed_tl = null;
        throw new Error('HufBuild error: ' + h.status, 'rawinflate.js');
        return -1;
      }
      zip_fixed_td = h.root;
      zip_fixed_bd = h.m;
    }

    zip_tl = zip_fixed_tl;
    zip_td = zip_fixed_td;
    zip_bl = zip_fixed_bl;
    zip_bd = zip_fixed_bd;
    return zip_inflate_codes(buff, off, size);
  };

  var zip_inflate_dynamic = function (buff, off, size) {
    // decompress an inflated type 2 (dynamic Huffman codes) block.
    var i,
      j, // temporary variables
      l, // last length
      n, // number of lengths to get
      t, // (zip_HuftNode) literal/length code table
      h, // (zip_HuftBuild)
      ll = new Array(286 + 30); // literal/length and distance code lengths

    for (i = 0; i < ll.length; ++i) ll[i] = 0;

    // read in table lengths
    zip_NEEDBITS(5);
    var nl = 257 + zip_GETBITS(5); // number of literal/length codes
    zip_DUMPBITS(5);
    zip_NEEDBITS(5);
    var nd = 1 + zip_GETBITS(5); // number of distance codes
    zip_DUMPBITS(5);
    zip_NEEDBITS(4);
    var nb = 4 + zip_GETBITS(4); // number of bit length codes
    zip_DUMPBITS(4);
    if (nl > 286 || nd > 30) return -1; // bad lengths

    // read in bit-length-code lengths
    for (j = 0; j < nb; ++j) {
      zip_NEEDBITS(3);
      ll[zip_border[j]] = zip_GETBITS(3);
      zip_DUMPBITS(3);
    }
    for (; j < 19; ++j) ll[zip_border[j]] = 0;

    // build decoding table for trees--single level, 7 bit lookup
    zip_bl = 7;
    h = new zip_HuftBuild(ll, 19, 19, null, null, zip_bl);
    if (h.status != 0) return -1; // incomplete code set

    zip_tl = h.root;
    zip_bl = h.m;

    // read in literal and distance code lengths
    n = nl + nd;
    i = l = 0;
    while (i < n) {
      zip_NEEDBITS(zip_bl);
      t = zip_tl.list[zip_GETBITS(zip_bl)];
      j = t.b;
      zip_DUMPBITS(j);
      j = t.n;
      if (j < 16)
        // length of code in bits (0..15)
        ll[i++] = l = j;
      // save last length in l
      else if (j == 16) {
        // repeat last length 3 to 6 times
        zip_NEEDBITS(2);
        j = 3 + zip_GETBITS(2);
        zip_DUMPBITS(2);
        if (i + j > n) return -1;
        while (j-- > 0) ll[i++] = l;
      } else if (j == 17) {
        // 3 to 10 zero length codes
        zip_NEEDBITS(3);
        j = 3 + zip_GETBITS(3);
        zip_DUMPBITS(3);
        if (i + j > n) return -1;
        while (j-- > 0) ll[i++] = 0;
        l = 0;
      } else {
        // j == 18: 11 to 138 zero length codes
        zip_NEEDBITS(7);
        j = 11 + zip_GETBITS(7);
        zip_DUMPBITS(7);
        if (i + j > n) return -1;
        while (j-- > 0) ll[i++] = 0;
        l = 0;
      }
    }

    // build the decoding tables for literal/length and distance codes
    zip_bl = 9; // zip_lbits;
    h = new zip_HuftBuild(ll, nl, 257, zip_cplens, zip_cplext, zip_bl);
    if (zip_bl == 0)
      // no literals or lengths
      h.status = 1;
    if (h.status != 0) {
      // if (h.status == 1); // **incomplete literal tree**
      return -1; // incomplete code set
    }
    zip_tl = h.root;
    zip_bl = h.m;

    for (i = 0; i < nd; ++i) ll[i] = ll[i + nl];
    zip_bd = 6; // zip_dbits;
    h = new zip_HuftBuild(ll, nd, 0, zip_cpdist, zip_cpdext, zip_bd);
    zip_td = h.root;
    zip_bd = h.m;

    if (zip_bd == 0 && nl > 257) {
      // lengths but no distances
      // **incomplete distance tree**
      return -1;
    }

    //if (h.status == 1); // **incomplete distance tree**

    if (h.status != 0) return -1;

    // decompress until an end-of-block code
    return zip_inflate_codes(buff, off, size);
  };

  var zip_inflate_internal = function (buff, off, size) {
    // decompress an inflated entry
    var n = 0,
      i;

    while (n < size) {
      if (zip_eof && zip_method == -1) return n;

      if (zip_copy_leng > 0) {
        if (zip_method != 0 /*zip_STORED_BLOCK*/) {
          // STATIC_TREES or DYN_TREES
          while (zip_copy_leng > 0 && n < size) {
            --zip_copy_leng;
            zip_copy_dist &= zip_WSIZE - 1;
            zip_wp &= zip_WSIZE - 1;
            buff[off + n++] = zip_slide[zip_wp++] = zip_slide[zip_copy_dist++];
          }
        } else {
          while (zip_copy_leng > 0 && n < size) {
            --zip_copy_leng;
            zip_wp &= zip_WSIZE - 1;
            zip_NEEDBITS(8);
            buff[off + n++] = zip_slide[zip_wp++] = zip_GETBITS(8);
            zip_DUMPBITS(8);
          }
          if (zip_copy_leng == 0) zip_method = -1; // done
        }
        if (n == size) return n;
      }

      if (zip_method == -1) {
        if (zip_eof) break;

        // read in last block bit
        zip_NEEDBITS(1);
        if (zip_GETBITS(1) != 0) zip_eof = true;
        zip_DUMPBITS(1);

        // read in block type
        zip_NEEDBITS(2);
        zip_method = zip_GETBITS(2);
        zip_DUMPBITS(2);
        zip_tl = null;
        zip_copy_leng = 0;
      }

      switch (zip_method) {
        case 0: // zip_STORED_BLOCK
          i = zip_inflate_stored(buff, off + n, size - n);
          break;

        case 1: // zip_STATIC_TREES
          if (zip_tl != null) i = zip_inflate_codes(buff, off + n, size - n);
          else i = zip_inflate_fixed(buff, off + n, size - n);
          break;

        case 2: // zip_DYN_TREES
          if (zip_tl != null) i = zip_inflate_codes(buff, off + n, size - n);
          else i = zip_inflate_dynamic(buff, off + n, size - n);
          break;

        default:
          // error
          i = -1;
          break;
      }

      if (i == -1) return zip_eof ? 0 : -1;
      n += i;
    }
    return n;
  };

  JSROOT.ZIP = {};

  JSROOT.ZIP.inflate = function (arr, tgt) {
    if (!zip_slide) zip_slide = new Array(2 * zip_WSIZE);
    zip_wp = 0;
    zip_bit_buf = 0;
    zip_bit_len = 0;
    zip_method = -1;
    zip_eof = false;
    zip_copy_leng = zip_copy_dist = 0;
    zip_tl = null;

    zip_inflate_data = arr;
    zip_inflate_datalen = arr.byteLength;
    zip_inflate_pos = 0;

    var i,
      cnt = 0;
    while (
      (i = zip_inflate_internal(
        tgt,
        cnt,
        Math.min(1024, tgt.byteLength - cnt)
      )) > 0
    ) {
      cnt += i;
    }
    zip_inflate_data = null; // G.C.

    return cnt;
  };

  /**
   * https://github.com/pierrec/node-lz4/blob/master/lib/binding.js
   *
   * LZ4 based compression and decompression
   * Copyright (c) 2014 Pierre Curto
   * MIT Licensed
   */

  JSROOT.LZ4 = {};
  /**
   * Decode a block. Assumptions: input contains all sequences of a
   * chunk, output is large enough to receive the decoded data.
   * If the output buffer is too small, an error will be thrown.
   * If the returned value is negative, an error occured at the returned offset.
   *
   * @param input {Buffer} input data
   * @param output {Buffer} output data
   * @return {Number} number of decoded bytes
   * @private
   */
  JSROOT.LZ4.uncompress = function (input, output, sIdx, eIdx) {
    sIdx = sIdx || 0;
    eIdx = eIdx || input.length - sIdx;
    // Process each sequence in the incoming data
    for (var i = sIdx, n = eIdx, j = 0; i < n; ) {
      var token = input[i++];

      // Literals
      var literals_length = token >> 4;
      if (literals_length > 0) {
        // length of literals
        var l = literals_length + 240;
        while (l === 255) {
          l = input[i++];
          literals_length += l;
        }

        // Copy the literals
        var end = i + literals_length;
        while (i < end) output[j++] = input[i++];

        // End of buffer?
        if (i === n) return j;
      }

      // Match copy
      // 2 bytes offset (little endian)
      var offset = input[i++] | (input[i++] << 8);

      // 0 is an invalid offset value
      if (offset === 0 || offset > j) return -(i - 2);

      // length of match copy
      var match_length = token & 0xf;
      var l = match_length + 240;
      while (l === 255) {
        l = input[i++];
        match_length += l;
      }

      // Copy the match
      var pos = j - offset; // position of the match copy in the current output
      var end = j + match_length + 4; // minmatch = 4
      while (j < end) output[j++] = output[pos++];
    }

    return j;
  };

  return JSROOT;
});
