const fn = require('./jestprac')

test('1은 1이야.', ()=>{
    expect(1).toBe(1);
});

test('2더하기 3은 5야', ()=> {
    expect(fn.add(2,3)).toBe(5);
});

test('3더하기 3은 5가 아니야.', ()=>{
    expect(fn.add(3,3)).not.toBe(5);
})

test('이름 나이 객체 반환', ()=>{
    expect(fn.makeUser('Mike', 30)).toEqual({
        name: "Mike",
        age: 30,
    })
})

test('이름 나이 객체 반환', ()=>{
    expect(fn.makeUser('Mike', 30)).toStrictEqual({
        name: "Mike",
        age: 30,
    })
})