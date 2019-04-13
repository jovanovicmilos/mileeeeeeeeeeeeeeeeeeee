app.service("multpipleSelectService", function($http) {
    
    return {
        selectedItems: [],
        check: function (item) {
            if(this.selectedItems != 'undefined'){
                var index = this.selectedItems.indexOf(item);
                if(index > -1){
                    this.selectedItems.splice(index, 1);
                }else{
                    this.selectedItems.push(item);
                }
            }
        },
        exist: function(item) {
            if (this.selectedItems != 'undefined') {
                for (var i = 0; i < this.selectedItems.length; i++) {
                    if (this.selectedItems[i] == item) {
                        return -1;
                    }
                }
            }
        },
        checkAllOnPage: function(list, field, ischeck) {
            var ids = [];
            for (var i = 0; i < list.length; i++) {
                ids.push(list[i][field])
            }
            if (ischeck) {
                for (var i = 0; i < ids.length; i++) {
                    if (this.selectedItems.indexOf(ids[i]) === -1) {
                        this.selectedItems.push(ids[i]);
                    }
                }
            } else {
                for (var i = 0; i < ids.length; i++) {
                    if (this.selectedItems.indexOf(ids[i]) !== -1) {
                        this.selectedItems.splice(this.selectedItems.indexOf(ids[i]), 1);
                    }
                }
            }
        },
        isAllChecked: function(list, field, onPage) {
            if (list != 'undefined') {
                let ids = [];
                for (var i = 0; i < list.length; i++) {
                    ids.push(list[i][field])
                }
                let tempSelectedIds = this.selectedItems;
                let selectedIds = ids.filter(function (f) {
                    return tempSelectedIds.indexOf(f) >= 0;
                });

                if (onPage) {
                    this.selectedItems = selectedIds;
                }

                return selectedIds.length === list.length;
            }
        }
        
    }
    
})
