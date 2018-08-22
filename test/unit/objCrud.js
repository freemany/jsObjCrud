const data = require('../asset/data.json');
const {ObjCrud} = require('../../src/obj-crud.js');

describe('ObjCrud.js', () => {
    describe('constructor', () => {
        it('should have method init', () => {
            const objCrud = new ObjCrud();
            objCrud.init.should.be.a('function');
        });

        it('should get the same data', () => {
            const objCrud = new ObjCrud(data);
            expect(objCrud.getData()).to.eql(data);
        });
    });

    describe('CRUD', () => {
        it('should throw error when add', () => {
            const objCrud = new ObjCrud();
            const node = {id:9, title:'freeman', parent:2};
            expect(() => objCrud.add(node)).to.throw(Error);
        });

        it('should add without parent', () => {
            const node = {id: 9, title: 'freeman'};
            let myData = JSON.parse(JSON.stringify(data));
            myData.push(node);

            const objCrud = new ObjCrud(data);

            objCrud.add(node);
            expect(objCrud.getData()).to.eql(myData);
        });

        it('should add with parent', () => {
            const node = {id: 9, title: 'freeman', parent: 2};
            const expected = [
                {id: 1, title: "foo", children:[]},
                {id: 2, title: "bar",
                    children: [
                        {id: 3, title:"bar bar", children:[], "parent": 2},
                        {id: 4, title:"bar car", children:[], "parent": 2},
                        {id: 9, title: 'freeman', parent: 2}
                    ]
                },
                {id: 5, title: "coo", children:[]}
            ];

            const objCrud = new ObjCrud(data);

            objCrud.add(node);
            expect(objCrud.getData()).to.eql(expected);
        });
    });
});
/* Usage examples */
// const data = [
//     {id:1, title: 'foo', children:[]},
//     {id:2, title:'bar',
//         children:[
//             {id:3, title:'bar bar', children:[], parent:2},
//             {id:4, title:'bar car', children:[], parent:2}
//         ]
//     },
//     {id:5, title: 'coo', children:[]},
// ];
//
// let crud = new Fy.objCrud(data); //immutable by default
// let crud = new Fy.objCrud(); //immutable by default
// console.log(crud.getData());
// try {
// console.log(crud.add({id:9, title:'freeman', parent:2}));
// } catch(err) {
//     console.log(err.message)
// }

// console.log(crud.add({id:9, title:'freeman'}));
// console.log(crud.getData());

// console.log(crud.remove(2));
// console.log(crud.remove(4));
// console.log(crud.edit({id: 2, title: 'new value', }));
// console.log(crud.edit({id: 4, title: 'shit', children:[]})[1].children)

//find
// console.log(crud.find({title:'bar car'}));
// console.log(crud.find({id:5}));
// console.log('origin',data)