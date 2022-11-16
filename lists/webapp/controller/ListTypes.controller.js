sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        function getGroupHeader(oGroup){
            var groupHeaderListItem = new sap.m.GroupHeaderListItem({
                title : oGroup.key,
                upperCase: true
            })
            return groupHeaderListItem;
        }

        function onShowSelectedRows(){
            var standardList = this.getView().byId("standardList");
            var selectedItems = standardList.getSelectedItems();

            var i18nModel = this.getView().getModel("i18n").getResourceBundle();
            if(selectedItems.length === 0){
                sap.m.MessageToast.show(i18nModel.getText("noSelection"))
            }else{
                var textMessage = i18nModel.getText("Selection");
                for(var i in selectedItems){
                    var context = selectedItems[i].getBindingContext();
                    var objectContext = context.getObject();
                    textMessage = textMessage + "-" + objectContext.Material
                }
                sap.m.MessageToast.show(textMessage)
            }
        }
        
        function onDeleteSelectedRows(){
            var standardList = this.getView().byId("standardList");
            var selectedItems = standardList.getSelectedItems();

            var i18nModel = this.getView().getModel("i18n").getResourceBundle(); 

            if(selectedItems.length === 0){
                sap.m.MessageToast.show(i18nModel.getText("noSelection"))
            }else{
                var textMessage = i18nModel.getText("Eliminado");
                var model = this.getView().getModel();
                var products = model.getProperty("/Products");
                var arrayId = [];
                for(var i in selectedItems){
                    var context = selectedItems[i].getBindingContext();
                    var objectContext = context.getObject();
                    arrayId.push(objectContext.Id);
                    textMessage = textMessage + "-" + objectContext.Material
                }

                products = products.filter(function(p){
                    return !arrayId.includes(p.Id)
                })
                model.setProperty("/Products",products);
                standardList.removeSelections();
                sap.m.MessageToast.show(textMessage)
            }
        }

        function onDeleteRow(oEvent){
            var selectRow = oEvent.getParameter("listItem");
            var context = selectRow.getBindingContext();
            var splitPath = context.getPath().split("/");
            var indexSelectedRow = splitPath[splitPath.length -1];
            var model = this.getView().getModel();
            var products = model.getProperty("/Products");
            products.splice(indexSelectedRow,1);
            model.refresh();
        }

        return Controller.extend("logaligroup.lists.controller.ListTypes", {
            onInit: function () {
                var oJsonModel = new JSONModel();
                oJsonModel.loadData("./localService/mockdata/ListData.json");
                this.getView().setModel(oJsonModel);
            },
            getGroupHeader : getGroupHeader,
            onShowSelectedRows : onShowSelectedRows,
            onDeleteSelectedRows : onDeleteSelectedRows,
            onDeleteRow : onDeleteRow
        });
    });
