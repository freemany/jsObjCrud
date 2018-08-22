const data = require('../asset/data.json');
const ObjCrud = require('../../src/obj-crud.js');

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

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
            let myData = cloneData(data);
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

        it('should remove node with id', () => {
            const nodeId = 3;
            const expected = [
                {id: 1, title: "foo", children:[]},
                {id: 2, title: "bar",
                    children: [
                        {id: 4, title:"bar car", children:[], "parent": 2}
                    ]
                },
                {id: 5, title: "coo", children:[]}
            ];

            const objCrud = new ObjCrud(data);

            objCrud.remove(nodeId);
            expect(objCrud.getData()).to.eql(expected);
        });

        it('should find node', () => {
            const node = {id: 4};
            const expected = {id: 4, title:"bar car", children:[], "parent": 2};

            const objCrud = new ObjCrud(data);

            expect(objCrud.find(node)).to.eql(expected);
        });

        it('should find node with property', () => {
            const node = {title:"bar car"};
            const expected = {id: 4, title:"bar car", children:[], "parent": 2};

            const objCrud = new ObjCrud(data);

            expect(objCrud.find(node)).to.eql(expected);
        });

        it('should edit a child node with node', () => {
            const node = {id: 4, title:"freeman", "parent": 2};
            const expected = [
                {id: 1, title: "foo", children:[]},
                {id: 2, title: "bar",
                    children: [
                        {id: 3, title:"bar bar", children:[], "parent": 2},
                        {children:[], id: 4, title:"freeman", "parent": 2},
                    ]
                },
                {id: 5, title: "coo", children:[]}
            ];

            const objCrud = new ObjCrud(data);
            objCrud.edit(node);
            expect(objCrud.getData()).to.eql(expected);
        });

        it('should edit a parent node with node', () => {
            const node = {id: 2, title:"freeman", children:[]};
            const expected = [
                {id: 1, title: "foo", children:[]},
                {id: 2, title: "freeman", children:[]},
                {id: 5, title: "coo", children:[]}
            ];

            const objCrud = new ObjCrud(data);
            objCrud.edit(node);
            expect(objCrud.getData()).to.eql(expected);
        });
    });
});
