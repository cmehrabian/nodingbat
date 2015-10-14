Template.exerciseItem.helpers({
  editorOptions: function() {
      return {
        lineNumbers: true,
        mode: "javascript"
      }
    },
  editorCode: function() {
    return "Code to show in editor";
  },
  item: function(){
    return getExercise();
  },
  exercises: function() {
    console.log(FlowRouter.current().params.name);
  	return Exercises.find({name: FlowRouter.current().params.name});
  }
});

Template.exerciseItem.rendered = function () {
  session_set();
  // try{
  //   var obj = eval(Session.get("varName"));
  // }
  // catch(e){
  //   console.log("it crashed!");
  //   console.log(e);
  // }
  // var obj = eval(Session.get("varName"));
  // var renderRun = function(self){
  //   // console.log("asd");
  //   var obj = eval(Session.get("varName"));
  //   var index = 0;
  //   for( ; index < self.inputs.length; ++index){
  //     // var userOutput = eval(self.name + self.inputs[index]);
  //     var output = eval("solutions." + self.name + self.inputs[index]);
  //       var thisDiv = $("div.testCases:nth-child("+(index + 1)+")").css("background-color", "white");
  //       console.log(thisDiv);
  //   return thisDiv.html(self.name+self.inputs[index]+"<i class='fa fa-long-arrow-right'></i>"+ output);
  //   }
  // }
  // renderRun(this.self);
}


Template.exerciseItem.events({
  "getEditorText": function() {
    return Session.get("varName"); // "varName" is variable name you provided to reactiveVar
  },
  'keypress #code-mirror': function(e) {
    if(e.keyCode != 13)
      return;
    run(getExercise());
  },
  'click #run': function(){
    run(getExercise());
  },
  'click #help': function(){
    Session.set("postList", this._id);
  }
});

var enclose = function(functionString){
  return eval(functionString);
}

var getExercise = function(){
  return Exercises.findOne({name: FlowRouter.current().params.name})
}

var session_set = function(){
  Session.set('success', null);
  Session.set('failure', null);
  // Session.set('exerciseForum', null);
  Session.set("varName", getExercise().setup);
}

var abiShake = function(){
  $('h1.animated').toggleClass('shake');
}

var run = function(self){
  try{
    var obj = eval(Session.get("varName"));
  }
  catch(e){
    console.log("it crashed!");
    console.log(e);
  }
  var obj = eval(Session.get("varName"));
  var solutionIndex = 1;
  $(".rotate").toggleClass("down");

  // self is this
  // var this = self;
  var index = 0;
  for( ; index < self.inputs.length; ++index){
    var userOutput = eval(self.name + self.inputs[index]);
    var output = eval("solutions." + self.name + self.inputs[index]);

    if(output == userOutput){
      var currentDiv = $("div.colors:nth-child("+(index + 1)+")").css("background-color", "green");
      console.log(currentDiv.html);

      solutionIndex++;
      currentDiv.html(self.name+self.inputs[index]+"<i class='fa fa-long-arrow-right'></i>"+ output +" <i class='fa fa-smile-o'></i> "+ userOutput );
    }
    else{
      var currentDiv = $("div.colors:nth-child("+(index+1)+")").css("background-color", "red");;
      currentDiv.html(self.name+self.inputs[index]+"<i class='fa fa-long-arrow-right'></i>"+ output +" <i class='fa fa-frown-o'></i> "+ userOutput );
      abiShake();
    }
  }

  if (solutionIndex == (index+1)){
    Session.set('failure', null);
    Session.set('success', getExercise()._id);
    Meteor.call("userUpdate", getExercise().name);

  }else{
    Session.set('success', null);
    Session.set('failure', getExercise()._id);
  }
}
