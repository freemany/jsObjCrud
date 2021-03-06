const ObjCrud = function(data, opts) {

   opts || (opts = {}); 

   let defaults = {
       mutable: false
   }
   this.defaults = this._extend(defaults, opts);

   this.data = this.defaults.mutable === false ? this._copy(data) : data;
   this.init();
};


ObjCrud.prototype = {

    init: function() {},

    _copy: function(data) {
        if (data === undefined || data === null) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(data));
    },

    _extend: function(o, n) {

        for(let key in n) {
            o[key] = n[key];
        }

        return o;
    },

    setData: function(data) {
       this.data = this.defaults.mutable === false ? this._copy(data) : data;
       return this;
    },

    getData:function() {
       return this.data;
    },

    _checkData: function() {
        if (this.data === undefined) {
            throw new Error('Data is not set');
        }
    },

    _getParent: function(obj, data) {

        let parent = {};

        for(var i=0; i< data.length; i++) {

          if (data[i].id === obj.parent) {
              return data[i];
          }

         if (data[i].children !== undefined && data[i].children.length>0) {

             parent = this._getParent(obj, data[i].children);
             if (parent !== undefined) {
                  return parent;
             }
         }

       }
    },
    //find node by node id or key
    find: function(node) {
       
       let data = this.data;
       return this._doFind(node, data);

    },
    _doFind: function(node, data) {
       
       for(let i=0; i<data.length; i++) {
    
           for(let key in node) {
               if (data[i][key] !== undefined && data[i][key] == node[key]) {
                   return data[i];
               }
           }

           if (undefined !== data[i].children && data[i].children.length > 0) {
               let found = this._doFind(node, data[i].children);
               if (found !== false) {
                   return found;
               }
           }
       }

       return false;
    },

    //add 
    add: function(node) {

        this._checkData();

        if (node.parent === undefined || node.parent === 0 || node.parent === null) {
            this.data.push(node);
            return this.data;
        }

        let parent = this._getParent(node, this.data);

        if(parent === undefined) {
            return false;
        }

        if (parent.children === undefined) {
            parent['children'] = [];
        }
        parent.children.push(node);

        return this.data;
        
    },
    
    //remove
    remove: function(id) {

       this._checkData();
       let data = this.data; 
       if (false === this._doRemove(id, data, true)) {
           return false;
       }
       return this.data;
    },

    _doRemove: function(id, data, top) {

        if (top === true) {
            for(var i=0;i<data.length;i++) {
               if (data[i].id == id) {
                   data.splice(i, 1);
                   return true;
               }
            }  

            return this._doRemove(id, data, false);  
        }

         for(var i=0;i<data.length;i++) {
            if (data[i].children !== undefined && data[i].children.length > 0) {
                 var children = [];
                 for(var j=0;j<data[i].children.length;j++) {
                   if (data[i].children[j].id != id) {
                       children.push(data[i].children[j]);
                   }
                 }
                 let cacheChildren = data[i].children;
                 data[i].children = children;
                 if (cacheChildren.length > children.length) {
                       return true;
                 }
                 return this._doRemove(id, data[i].children, false);
            }
         }

         return false;
    },
    
    //edit
    edit: function(node) {
        
        this._checkData();
        let data = this.data;

        if (false === this._doEdit(node, data)) {
            return false;
        }

        return this.data;
    },

    _doEdit: function(node, data) {

      for(var i=0;i<data.length;i++) {

      if (node.id == data[i].id) {

          for(let key in node) {
              if (key !== 'id') {
                 data[i][key] = node[key];
              }
          }
        return true;
      }
      if (data[i].children !== undefined && data[i].children.length > 0) {
        return this._doEdit(node, data[i].children);
      }
     }
     return false;
    }
    
};

module.exports = ObjCrud;

