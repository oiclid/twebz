function(cb, e, params) {
  var widget = $(this)
  , app = $$(widget).app
  , cloud = app.require("lib/wordcloud")
  , name = e.data.args[1].screen_name.toLowerCase()
  ;
  function userCloud(gWC) {
    app.view("userWordCount",{
      startkey : [name],
      endkey : [name, {}],
      group_level : 2,
      success : function(view) {
        var userWords = cloud.userCount(view, gWC);
        cb(userWords);
      }
    });
  };
  app.db.openDoc("globalWordCount", {
    success : function(gWCdoc) {
      userCloud(gWCdoc.cloud);
    },
    error : function() {
      // create the global cloud
      app.view("globalWordCount", {
        "group_level" : 1,
        success : function(view) {
          var gWC = cloud.globalCount(view);
          app.db.saveDoc({_id:"globalWordCount", cloud : gWC});
          userCloud(gWC);
        }
      });
    }
  })
};