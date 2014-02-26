function HandlebarsWatcher(){
	this.sourceDir = null;
	this.destinationDir = null;
	this.pathToHandlebars = null;
	this.exec = require('child_process').exec;
	this.path = require("path");
	this.fs = require("fs");
};



HandlebarsWatcher.prototype.watch = function(sourceDir, destinationDir, pathToHandlebars) {

	this.sourceDir = this.handlePath(sourceDir) || null;
	this.destinationDir = this.handlePath(destinationDir) || this.sourceDir;
	this.pathToHandlebars = pathToHandlebars || this.handlePath("./node_modules/handlebars/bin/handlebars");

	if(this.sourceDir == null){
		throw "Source directory not defined!";
		return;
	};

	var self = this;

	this.fs.watch(this.sourceDir, function(eventType, fileName){
		if(fileName.search(/\.handlebars$/) === -1) return;

		var execStatement = [
			 self.pathToHandlebars
			,self.sourceDir
			,"-f"
			,self.path.normalize(
				self.destinationDir + "/" + fileName.replace(/\.handlebars/, ".js")
			)
		];
		self.exec(execStatement.join(" "))
	});

};



HandlebarsWatcher.prototype.handlePath = function(path) {
	var workingDir = this.path.dirname(process.mainModule.filename);
	return this.path.resolve(workingDir, path);
};




module.exports = new HandlebarsWatcher();
