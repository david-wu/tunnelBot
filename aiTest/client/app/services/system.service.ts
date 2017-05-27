import {Inject, Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const _ = require('lodash');

@Injectable()
export class SystemService{

	constructor(
		private http: Http,
		@Inject('api') private api:string,
	){

	}

	url = this.api+'/system';

	get(systemIds=[]){
		if(!systemIds.length){
			return this.http.get(this.url)
		}
	}

	save(system){
		return this.http.post(this.url, system)
	}

	update(system){
		return this.http.put(`${this.url}/${system.id}`, system)
	}

	delete(id){
		return this.http.delete(`${this.url}/${id}`)
	}

}
