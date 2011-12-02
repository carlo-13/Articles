Articles.grid.ContainerArticles = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();
    this.exp = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p class="desc">{content}</p>'
        )
    });
    Ext.applyIf(config,{
        id: 'articles-grid-container-articles'
        ,title: _('articles.articles')
        ,url: Articles.connector_url
        ,baseParams: {
            action: 'article/getList'
            ,'parent': config.resource
        }
        ,saveParams: {
            resource: config.resource
        }
        ,fields: ['id','pagetitle',
                  'publishedon','publishedon_date','publishedon_time',
                  'uri','uri_override','preview_url',
                  'createdby','createdby_username','tags','categories',
                  'actions','action_edit','content']
        ,paging: true
        ,remoteSort: true
        ,cls: 'articles-grid'
        ,sm: this.sm
        ,plugins: [this.exp]
        ,emptyText: _('articles.articles_none')
        ,columns: [this.sm,this.exp,{
            header: _('articles.publishedon')
            ,dataIndex: 'publishedon'
            ,width: 80
            ,sortable: true
            ,renderer: {fn:this._renderPublished,scope:this}
        },{
            header: _('articles.article_title')
            ,dataIndex: 'pagetitle'
            ,width: 200
            ,sortable: true
            ,renderer: {fn:this._renderPageTitle,scope:this}
        },{
            header: _('articles.author')
            ,dataIndex: 'createdby_username'
            ,width: 150
            ,sortable: false
            ,renderer: {fn:this._renderAuthor,scope:this}
        },{
            header: _('articles.tags')
            ,dataIndex: 'tags'
            ,width: 200
            ,sortable: true
        }]
        ,tbar: [{
            text: _('articles.article_create')
            ,handler: this.createArticle
            ,scope: this
        },{
            text: _('bulk_actions')
            ,menu: [{
                text: _('articles.article_selected_publish')
                ,handler: this.publishSelected
                ,scope: this
            },{
                text: _('articles.article_selected_unpublish')
                ,handler: this.unpublishSelected
                ,scope: this
            },'-',{
                text: _('articles.article_selected_delete')
                ,handler: this.deleteSelected
                ,scope: this
            },{
                text: _('articles.article_selected_undelete')
                ,handler: this.undeleteSelected
                ,scope: this
            }]
        },'->',{
            xtype: 'articles-combo-filter-status'
            ,id: 'articles-grid-filter-status'
            ,value: ''
            ,listeners: {
                'select': {fn:this.filterStatus,scope:this}
            }
        },{
            xtype: 'textfield'
            ,name: 'search'
            ,id: 'articles-article-search'
            ,emptyText: _('search_ellipsis')
            ,listeners: {
                'change': {fn: this.search, scope: this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: function() {
                            this.fireEvent('change',this.getValue());
                            this.blur();
                            return true;}
                        ,scope: cmp
                    });
                },scope:this}
            }
        },{
            xtype: 'button'
            ,id: 'modx-filter-clear'
            ,text: _('filter_clear')
            ,listeners: {
                'click': {fn: this.clearFilter, scope: this}
            }
        }]
    });
    Articles.grid.ContainerArticles.superclass.constructor.call(this,config);
    this._makeTemplates();
    this.on('rowclick',MODx.fireResourceFormChange);
    this.on('click', this.onClick, this);
};
Ext.extend(Articles.grid.ContainerArticles,MODx.grid.Grid,{
    getMenu: function() {
        var r = this.getSelectionModel().getSelected();
        var p = r.data.perm;

        var m = [];

        m.push({
           text: _('articles.article_edit')
           ,handler: this.editPost
        });
        return m;
    }
    ,filterStatus: function(cb,nv,ov) {
        this.getStore().baseParams.filter = Ext.isEmpty(nv) || Ext.isObject(nv) ? cb.getValue() : nv;
        this.getBottomToolbar().changePage(1);
        this.refresh();
        return true;
    }
    
    ,search: function(tf,newValue,oldValue) {
        var nv = newValue || tf;
        this.getStore().baseParams.query = Ext.isEmpty(nv) || Ext.isObject(nv) ? '' : nv;
        this.getBottomToolbar().changePage(1);
        this.refresh();
        return true;
    }
    ,clearFilter: function() {
    	this.getStore().baseParams = {
            action: 'article/getList'
            ,'parent': this.config.resource
    	};
        Ext.getCmp('articles-article-search').reset();
    	this.getBottomToolbar().changePage(1);
        this.refresh();
    }

    ,_makeTemplates: function() {
        this.tplPublished = new Ext.XTemplate('<tpl for=".">'
            +'<div class="articles_grid_date">{publishedon_date}<span class="articles_grid_time">{publishedon_time}</span></div>'
        +'</tpl>',{
			compiled: true
		});
        this.tplPageTitle = new Ext.XTemplate('<tpl for=".">'
										    +'<h3 class="main-column"><a href="{action_edit}" title="Edit {pagetitle}">{pagetitle}</a></h3>'
												+'<tpl if="actions">'
													+'<ul class="actions">'
														+'<tpl for="actions">'
															+'<li><a href="#" class="controlBtn {className}">{text}</a></li>'
														+'</tpl>'
													+'</ul>'
												+'</tpl>'
											+'</tpl>',{
			compiled: true
		});
    }

	,_renderPublished:function(v,md,rec) {
		return this.tplPublished.apply(rec.data);
	}
	,_renderPageTitle:function(v,md,rec) {
		return this.tplPageTitle.apply(rec.data);
	}

    ,editArticle: function(btn,e) {
        location.href = 'index.php?a='+MODx.request.a+'&id='+this.menu.record.id;
    }
    ,createArticle: function(btn,e) {
        location.href = 'index.php?a='+MODx.action['resource/create']+'&class_key=Article&parent='+MODx.request.id;
    }
    ,viewArticle: function(btn,e) {
        window.open(this.menu.record.data.preview_url);
        return false;
    }

    ,deleteArticle: function(btn,e) {
        MODx.Ajax.request({
            url: MODx.config.connectors_url+'resource/index.php'
            ,params: {
                action: 'delete'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success':{fn:this.refresh,scope:this}
            }
        });
    }

    ,deleteSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        MODx.msg.confirm({
            title: _('articles.article_delete_multiple')
            ,text: _('articles.article_delete_multiple_confirm')
            ,url: this.config.url
            ,params: {
                action: 'article/deleteMultiple'
                ,ids: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    }

    ,undeleteSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'article/undeleteMultiple'
                ,ids: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    }

    ,undeleteArticle: function(btn,e) {
        MODx.Ajax.request({
            url: MODx.config.connectors_url+'resource/index.php'
            ,params: {
                action: 'undelete'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success':{fn:this.refresh,scope:this}
            }
        });
    }

    ,publishSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'article/publishMultiple'
                ,ids: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    }

    ,unpublishSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;

        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'article/unpublishMultiple'
                ,ids: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    }

    ,publishArticle: function(btn,e) {
        MODx.Ajax.request({
            url: MODx.config.connectors_url+'resource/index.php'
            ,params: {
                action: 'publish'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success':{fn:this.refresh,scope:this}
            }
        });
    }

    ,unpublishArticle: function(btn,e) {
        MODx.Ajax.request({
            url: MODx.config.connectors_url+'resource/index.php'
            ,params: {
                action: 'unpublish'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success':{fn:this.refresh,scope:this}
            }
        });
    }


	,onClick: function(e){
		var t = e.getTarget();
		var elm = t.className.split(' ')[0];
		if(elm == 'controlBtn') {
			var action = t.className.split(' ')[1];
			var record = this.getSelectionModel().getSelected();
            this.menu.record = record;
			switch (action) {
                case 'delete':
                    this.deleteArticle();
                    break;
                case 'undelete':
                    this.undeleteArticle();
                    break;
                case 'edit':
					this.editArticle();
                    break;
				case 'publish':
					this.publishArticle();
					break;
				case 'unpublish':
					this.unpublishArticle();
					break;
				case 'view':
					this.viewArticle();
					break;
				default:
					window.location = record.data.edit_action;
					break;
            }
		}
	}
});
Ext.reg('articles-grid-container-articles',Articles.grid.ContainerArticles);