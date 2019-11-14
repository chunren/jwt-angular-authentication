// https://stackoverflow.com/questions/48075688/how-to-decode-the-jwt-encoded-token-payload-on-client-side-in-angular-5
/*
Use @auth0/angular-jwt


Step - 1 : Install using npm

npm install @auth0/angular-jwt

Step - 2 : Import the package

import { JwtHelperService } from '@auth0/angular-jwt';

Step - 3 : Create an instance and use

const helper = new JwtHelperService();

const decodedToken = helper.decodeToken(myRawToken);

// Other functions
const expirationDate = helper.getTokenExpirationDate(myRawToken);
const isExpired = helper.isTokenExpired(myRawToken);

*/

// tool:  https://jwt.io/
//https://www.unixtimestamp.com/
/* 
1514592000 Is equivalent to: 12/30/2017  @12: 00am(UTC)
1539129600 Is equivalent to: 10/10/2018  @12: 00am(UTC)
1546300800 Is equivalent to: 01/01/2019  @12: 00am(UTC)
1924905600 Is equivalent to: 12/31/2030 @12: 00am(UTC)
iat: (issued at) claim identifies the time at which the JWT was issued.
exp: expiration time

-------------------------------
Header: 
{
  "alg": "HS256",
  "typ": "JWT"
}
Payload: 
{
  "userName": "dan",
  "firstName": "Daniel",
  "lastName": "Smith",
  "emailAddress": "daniel.smith@xyz777.com",
  "iat":1546300800,
  "exp":1924905600
}
secret: abcd123456
access token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRhbiIsImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiU21pdGgiLCJlbWFpbEFkZHJlc3MiOiJkYW5pZWwuc21pdGhAeHl6Nzc3LmNvbSIsImlhdCI6MTU0NjMwMDgwMCwiZXhwIjoxOTI0OTA1NjAwfQ.e7uA4J2FSTkK9kAtNiTFqKMYrFRCwWoQamfi5rj-SPM
-----------------------------
Header: {
  "alg": "HS256",
  "typ": "JWT"
}
Payload: 
{
  "userName": "tim",
  "firstName": "Tim",
  "lastName": "Miller",
  "emailAddress": "tim.Miller@xyz777.com",
  "iat":1546300800,
  "exp":1924905600
}
secret: abcd123456
access token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ


-----------------------------
Header: {
  "alg": "HS256",
  "typ": "JWT"
}
Payload:
{
  "userName": "bob",
  "firstName": "Bob",
  "lastName": "Kweinlousi",
  "emailAddress": "bob.Kweinlousi@xyz777.com",
  "iat":1514592000,
  "exp":1539129600
}
secret: abcd123456
access token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImJvYiIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiS3dlaW5sb3VzaSIsImVtYWlsQWRkcmVzcyI6ImJvYi5Ld2VpbmxvdXNpQHh5ejc3Ny5jb20iLCJpYXQiOjE1MTQ1OTIwMDAsImV4cCI6MTUzOTEyOTYwMH0.sVqprALY4GpasVYlVC1c2n4KTHE3Rf1PUQHL43wwEtU

--------------------------------------------
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRhbiIsImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiU21pdGgiLCJlbWFpbEFkZHJlc3MiOiJkYW5pZWwuc21pdGhAeHl6Nzc3LmNvbSIsImlhdCI6MTU0NjMwMDgwMCwiZXhwIjoxOTI0OTA1NjAwfQ.e7uA4J2FSTkK9kAtNiTFqKMYrFRCwWoQamfi5rj-SPM
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImJvYiIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiS3dlaW5sb3VzaSIsImVtYWlsQWRkcmVzcyI6ImJvYi5Ld2VpbmxvdXNpQHh5ejc3Ny5jb20iLCJpYXQiOjE1MTQ1OTIwMDAsImV4cCI6MTUzOTEyOTYwMH0.sVqprALY4GpasVYlVC1c2n4KTHE3Rf1PUQHL43wwEtU

*/


import { Injectable } from "@angular/core";
import { UserData } from "../models/userdata.interface";
import { Transaction } from "../models/transaction.interface";
import { Hashmap } from "../models/hashmap.interface";

@Injectable ({ providedIn: "root" })
export class MockDataService {

	public get users(): UserData[] {
		return [
			{
				userName: "dan",
				password: "d123",
				firstName: "Daniel",
				lastName: "Smith",
				emailAddress: "daniel.smith@xyz777.com"
			},
			{
				userName: "tim",
				password: "tim78",
				firstName: "Tim",
				lastName: "Miller",
				emailAddress: "tim.Miller@xyz777.com"
			},
			{
				userName: "bob",
				password: "bob2",
				firstName: "Bob",
				lastName: "Kweinlousi",
				emailAddress: "bob.Kweinlousi@xyz777.com"
			}
		]
	}

	public get tokenHash(): Hashmap {
		return {
			dan:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRhbiIsImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiU21pdGgiLCJlbWFpbEFkZHJlc3MiOiJkYW5pZWwuc21pdGhAeHl6Nzc3LmNvbSIsImlhdCI6MTU0NjMwMDgwMCwiZXhwIjoxOTI0OTA1NjAwfQ.e7uA4J2FSTkK9kAtNiTFqKMYrFRCwWoQamfi5rj-SPM",
			tim:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ",
			bob:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImJvYiIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiS3dlaW5sb3VzaSIsImVtYWlsQWRkcmVzcyI6ImJvYi5Ld2VpbmxvdXNpQHh5ejc3Ny5jb20iLCJpYXQiOjE1MTQ1OTIwMDAsImV4cCI6MTUzOTEyOTYwMH0.sVqprALY4GpasVYlVC1c2n4KTHE3Rf1PUQHL43wwEtU"
		};
	}

	public get transactions(): Transaction[] {
		return [
			{
				userName: "dan",
				transactionId: 1,
				transactionRef: "X890W567",
				action: "Transfer In",
				amount: 3000.0,
				subjectName: "Linda Schmit",
				transactionDate: new Date("2019-01-16"),
				transactionMethod: "www"
			},
			{
				userName: "dan",
				transactionId: 2,
				transactionRef: "Y378W547",
				action: "Transfer In",
				amount: 6000.0,
				subjectName: "Peter Song",
				transactionDate: new Date("2019-09-19"),
				transactionMethod: "ACH"
			},
			{
				userName: "dan",
				transactionId: 3,
				transactionRef: "Q569T643",
				action: "Transfer Out",
				amount: 2000.0,
				subjectName: "Terry Mingie",
				transactionDate: new Date("2019-10-31"),
				transactionMethod: "www"
			},
			{
				userName: "tim",
				transactionId: 4,
				transactionRef: "A333K789",
				action: "Transfer In",
				amount: 870.0,
				subjectName: "Kurt Peterson",
				transactionDate: new Date("2019-04-08"),
				transactionMethod: "ACH"
			},
			{
				userName: "tim",
				transactionId: 5,
				transactionRef: "S657Y896",
				action: "Transfer Out",
				amount: 64.0,
				subjectName: "Julia King",
				transactionDate: new Date("2019-11-01"),
				transactionMethod: "www"
			}
		];
	}
}