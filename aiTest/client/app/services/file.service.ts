import {Inject, Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const _ = require('lodash');

@Injectable()
export class FileService{

	constructor(
		private http: Http,
		@Inject('api') private api:string,
	){

	}

	url = this.api+'/file';

	get(fileIds=[]){
		if(!fileIds.length){
			return this.http.get(this.url)
		}
	}

	save(file){
		return this.http.post(this.url, file)
	}

	update(file){
		return this.http.put(`${this.url}/${file.id}`, file)
	}

	delete(id){
		return this.http.delete(`${this.url}/${id}`)
	}

}
