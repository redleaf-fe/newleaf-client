// copy from https://github.com/pkrumins/node-jsmin

export default function jsmin(input, level, comment) {
  if (!input) return '';
  if (!level) level = 2;
  if (!comment) comment = '';

  let a = '';
  let b = '';
  const EOF = -1;
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const DIGITS = '0123456789';
  const ALNUM = LETTERS + DIGITS + '_$\\';
  let theLookahead = EOF;

  /* isAlphanum -- return true if the character is a letter, digit, underscore,
  dollar sign, or non-ASCII character.
  */

  function isAlphanum(c) {
    return c != EOF && ((ALNUM.indexOf(c) > -1) || c.charCodeAt(0) > 126);
  }

  /* getc(IC) -- return the next character. Watch out for lookahead. If the
  character is a control character, translate it to a space or
  linefeed.
  */

  let iChar = 0;
  const lInput = input.length;
  function getc() {
    let c = theLookahead;
    if (iChar == lInput) {
      return EOF;
    }
    theLookahead = EOF;
    if (c == EOF) {
      c = input.charAt(iChar);
      ++iChar;
    }
    if (c >= ' ' || c == '\n') {
      return c;
    }
    if (c == '\r') {
      return '\n';
    }
    return ' ';
  }
  function getcIC() {
    let c = theLookahead;
    if (iChar == lInput) {
      return EOF;
    }
    theLookahead = EOF;
    if (c == EOF) {
      c = input.charAt(iChar);
      ++iChar;
    }
    if (c >= ' ' || c == '\n' || c == '\r') {
      return c;
    }
    return ' ';
  }

  /* peek -- get the next character without getting it.
   */

  function peek() {
    theLookahead = getc();
    return theLookahead;
  }

  /* next -- get the next character, excluding comments. peek() is used to see
  if a '/' is followed by a '/' or '*'.
  */

  function next() {
    let c = getc();
    if (c == '/') {
      switch (peek()) {
        case '/':
          for (;;) {
            c = getc();
            if (c <= '\n') {
              return c;
            }
          }
        case '*':
          // this is a comment. What kind?
          getc();
          if (peek() == '!') {
            // kill the extra one
            getc();
            // important comment
            let d = '/*!';
            for (;;) {
              c = getcIC(); // let it know it's inside an important comment
              switch (c) {
                case '*':
                  if (peek() == '/') {
                    getc();
                    return d + '*/';
                  }
                  break;
                case EOF:
                  throw new Error('Error: Unterminated comment.');
                default:
                  // modern JS engines handle string concats much better than the
                  // array+push+join hack.
                  d += c;
              }
            }
          } else {
            // unimportant comment
            for (;;) {
              switch (getc()) {
                case '*':
                  if (peek() == '/') {
                    getc();
                    return ' ';
                  }
                  break;
                case EOF:
                  throw 'Error: Unterminated comment.';
              }
            }
          }
        default:
          return c;
      }
    }
    return c;
  }

  /* action -- do something! What you do is determined by the argument:
  1   Output A. Copy B to A. Get the next B.
  2   Copy B to A. Get the next B. (Delete A).
  3   Get the next B. (Delete B).
  action treats a string as a single character. Wow!
  action recognizes a regular expression if it is preceded by ( or , or =.
  */

  function action(d) {
    const r = [];

    if (d == 1) {
      r.push(a);
    }

    if (d < 3) {
      a = b;
      if (a == "'" || a == '"') {
        for (;;) {
          r.push(a);
          a = getc();
          if (a == b) {
            break;
          }
          if (a <= '\n') {
            throw 'Error: unterminated string literal: ' + a;
          }
          if (a == '\\') {
            r.push(a);
            a = getc();
          }
        }
      }
    }

    b = next();

    if (b == '/' && ('(,=:[!&|'.indexOf(a) > -1)) {
      r.push(a);
      r.push(b);
      for (;;) {
        a = getc();
        if (a == '/') {
          break;
        } else if (a == '\\') {
          r.push(a);
          a = getc();
        } else if (a <= '\n') {
          throw 'Error: unterminated Regular Expression literal';
        }
        r.push(a);
      }
      b = next();
    }

    return r.join('');
  }

  /* m -- Copy the input to the output, deleting the characters which are
  insignificant to JavaScript. Comments will be removed. Tabs will be
  replaced with spaces. Carriage returns will be replaced with
  linefeeds.
  Most spaces and linefeeds will be removed.
  */

  function m() {
    const r = [];
    a = '';

    r.push(action(3));

    while (a != EOF) {
      switch (a) {
        case ' ':
          if (isAlphanum(b)) {
            r.push(action(1));
          } else {
            r.push(action(2));
          }
          break;
        case '\n':
          switch (b) {
            case '{':
            case '[':
            case '(':
            case '+':
            case '-':
              r.push(action(1));
              break;
            case ' ':
              r.push(action(3));
              break;
            default:
              if (isAlphanum(b)) {
                r.push(action(1));
              } else if (level == 1 && b != '\n') {
                r.push(action(1));
              } else {
                r.push(action(2));
              }
          }
          break;
        default:
          switch (b) {
            case ' ':
              if (isAlphanum(a)) {
                r.push(action(1));
                break;
              }
              r.push(action(3));
              break;
            case '\n':
              if (level == 1 && a != '\n') {
                r.push(action(1));
              } else {
                switch (a) {
                  case '}':
                  case ']':
                  case ')':
                  case '+':
                  case '-':
                  case '"':
                  case "'":
                    if (level == 3) {
                      r.push(action(3));
                    } else {
                      r.push(action(1));
                    }
                    break;
                  default:
                    if (isAlphanum(a)) {
                      r.push(action(1));
                    } else {
                      r.push(action(3));
                    }
                }
              }
              break;
            default:
              r.push(action(1));
              break;
          }
      }
    }

    return r.join('');
  }

  const ret = m(input);

  if (comment) {
    return comment + '\n' + ret;
  }
  return ret;
}
