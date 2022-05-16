const {mdLinks} = require('../index.js');

const path = 'lolita.md'
const path2 = 'md-files'
const path3 = 'nolinks.md'

describe('mdLink Function', () => {
  it('Should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });
  it('Should be returned a promise', (done) => {
    expect(mdLinks('lolita.md', {}) instanceof Promise).toBeTruthy()
    done()
  })
  it('Should be returned an array of links', (done) => {
    mdLinks(path, {}).then(result => {
      const expected = [
        {
          href: 'https://www.youtube.com/watch?v=lPPgY3HLlhQ',
          text: 'Píldora recursión - YouTube Laboratoria Developers',
          fileMd: 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/lolita.md'       
        },
        {
          href: 'https://medium.com/laboratoria-developers/recursi%C3%B3n-o-recursividad-ec8f1a359727',
          text: 'Recursión o Recursividad - Laboratoria Developers ',
          fileMd: 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/lolita.md'       
        }
      ];
      expect(result).toStrictEqual(expected)
      done()
    })
  })
  it('Should be returned an array of validated links', (done) => {
    mdLinks(path, {validate:true}).then(result => {
      const expected = [
        {
          href: 'https://www.youtube.com/watch?v=lPPgY3HLlhQ',
          text: 'Píldora recursión - YouTube Laboratoria Developers',
          fileMd: 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/lolita.md',
          status: 200,
          response: 'OK'
        },
        {
          href: 'https://medium.com/laboratoria-developers/recursi%C3%B3n-o-recursividad-ec8f1a359727',
          text: 'Recursión o Recursividad - Laboratoria Developers ',
          fileMd: 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/lolita.md',
          status: 503,
          response: 'FAIL'
        }
      ]
      expect(result).toStrictEqual(expected)
      done()
    })
  })
  it('Should be returned an object of validated stats', (done) => {
    mdLinks(path, {validate:true, stats:true}).then(result => {
      const expected = { Total: 2, Unique: 2, Broken: 1 }
      expect(result).toStrictEqual(expected)
      done()
    })
  });
  it('Should be returned an object of stats', (done) => {
    mdLinks(path, {stats:true}).then(result => {
      const expected = { Total: 2, Unique: 2 }
      expect(result).toStrictEqual(expected)
      done()
    })
  });
  it('Should be tested a recursion function', (done) => {
    mdLinks(path2, {}).then(result => {
      const expected = [
        {
          href: 'https://curriculum.laboratoria.la/es/topics/javascript/02-flow-control/01-conditionals-and-loops',
          text: 'Estructuras condicionales y repetitivas! Texto adi',
          fileMd: 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/md-files/directory/panterita.md'
        },
        {
          href: 'https://medium.com/laboratoria-developers/recursi%C3%B3n-o-recursividad-ec8f1a359727',
          text: 'Recursión o Recursividad - Laboratoria Developers ',
          fileMd: 'C:/Users/vivia/Desktop/md-links/BOG004-md-links/md-files/example.md'  }
      ];
      expect(result).toStrictEqual(expected)
      done()
    })
  })
})



