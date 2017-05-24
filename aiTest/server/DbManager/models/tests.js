const getModels = require('./index.js');


async function runTests(){
	const models = await getModels;
	const File = models.File
	const Project = models.Project

	await File.sync();
	await Project.sync();

	const fakeFile = await insertFakeFile();
	const fakeProject = await insertFakeProject();

	await fakeFile.addProject(fakeProject);

	const isProject = await fakeFile.getProjects();

	console.log('isProject', isProject)

	function insertFakeFile(){
		return File.create({
			path: 'test2.js',
			name: 'start',
			content: 'console.log("this is app.js");'
		});
	}

	function insertFakeProject(){
		return Project.create({
			name: 'myProject',
			description: 'awesome: ' + Math.floor(Math.random()*10),
		})
	}



}


module.exports = runTests