# jsObjCrud
Crud object in Javascript

CRUD Js object(each node has 'id', 'children' properties): 
1. Add a node
2. Remove a node
3. Edit a node

eg. 
data = [
    {id:1, title: 'foo', children:[]},
    {id:2, title:'bar', 
     children:[
           {id:3, title:'bar bar', children:[], parent:2},
           {id:4, title:'bar car', children:[], parent:2}
     ]
    }
    ];
    
