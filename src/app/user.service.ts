import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { User } from './user.model';
import 'rxjs/Rx';

@Injectable()
export class HttpUserService {
    constructor(private http: Http) { }

    sendData(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/jscon' });
        return this.http.post('https://hero-app-fe5d8.firebaseio.com/user.json', body, { headers: headers });
    }

    getData() {
        return this.http.get('https://hero-app-fe5d8.firebaseio.com/user.json').
            map((response: Response) => {
                const data = response.json();
                console.log("data: ", data);
                const returnArray = [];
                for (let key in data) {
                    returnArray.push(data[key])
                }
                return returnArray;
            }
            )
    }

    testSendData(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/jscon' });
        return this.http.post('http://localhost:8080/info', body, { headers: headers });
    }

}