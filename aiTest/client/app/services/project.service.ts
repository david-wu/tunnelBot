import {Inject, Injectable} from '@angular/core';
import { Http, Response }          from '@angular/http';
import 'rxjs/add/operator/toPromise';

const _ = require('lodash');

@Injectable()
export class ProjectService{

	constructor(
		private http: Http,
		@Inject('api') private api:string,
	){

	}

	url = this.api+'/project';

	get(projectIds=[]){
		if(!projectIds.length){
			return this.http.get(this.url)
		}
	}


	getFiles(projectId){
		return this.http.get(`${this.url}/${projectId}/files`);
	}

	save(project){
		return this.http.post(this.url, project)
	}

	update(project){
		return this.http.put(`${this.url}/${project._id}`, project)
	}

	delete(id){
		return this.http.delete(`${this.url}/${id}`)
	}

}
