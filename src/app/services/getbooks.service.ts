
import { Injectable, OnDestroy, Pipe } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { publishLast, mergeMap, map, switchMap, takeLast, takeUntil, mergeAll } from "rxjs/operators";
import { FirebaseApp } from "../../../node_modules/angularfire2";
import { promise } from "protractor";
import { Observable, observable, of, combineLatest, forkJoin, timer, interval } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection, DocumentSnapshot, Action, DocumentChangeAction, DocumentData } from 'angularfire2/firestore';
import { firestore } from "firebase";
import { AngularFireDatabase, snapshotChanges } from "angularfire2/database";
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from "../my-area/book.model";
import { User } from "../my-area/User.model";
import 'rxjs/Rx';
import 'rxjs/observable/of';
import { Options } from "selenium-webdriver/chrome";
import { take } from "rxjs-compat/operator/take";
import { combineAll } from "rxjs-compat/operator/combineAll";
import { filter } from "rxjs-compat/operator/filter";
import { BooksAvailibility, MatchLevel } from "../Entities/books-availibility";
import { PreUsers } from "../Entities/pre-users";
import googleMapsGeocoder from 'google-maps-geocoder';
import { AuthService } from "../auth/auth.service";



@Injectable()
export class GetBooksService {

  constructor(private db: AngularFirestore, private http: HttpClient) {
  }
  public userDetails: AngularFirestoreCollection;
  AvailableBooks = new Subject<Book[]>();
  books: Book[] = [];
  booksAvailibility: BooksAvailibility[];
  bookAvailibility: BooksAvailibility;
  userNameAvailibilty: string;
  userDistance: number;
  correlation: MatchLevel;
  booksRepo: Book[] = [
    { name: 'אדל', style: "סיפורת", id: "1" },
    { name: "בתו של סוחר המשי", style: "מתח", id: "2" },
    { name: "מפורסמת בעל כורחה", style: "דרמה", id: "4" },
    { name: "הראיון האחרון", style: "דרמה", id: "5", description: "סופר מנסה לענות על ראיון שנשלח אליו מאתר אינטרנט" },
    { name: "המנהרה", style: "רומן", id: "6" },
    { name: "המרגל האנגלי", style: "מותחן", id: "7" },
    { name: "הרעשנים 1 יוצאים משליטה", style: "ילדים", id: "8" },
    { name: "מאחורי עיניה", style: "מותחן", id: "32" }
  ];



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': 'Content-Length,Content-Range'
    })
  };

  /* region used Methods*/
  registerUser(adress: string, userID: string, latitude: number, longitude: number, name: string) {
    this.db.collection('UsersDetails')
      .add({ id: userID, latitude: latitude, longitude: longitude, adress: adress, name: name })
    .then(sucess=>{
      console.log(sucess);
    })
    .catch(error=>{
        console.log(error);
    })

  }
  getUserBooks(usersid: string[], collection: string): Observable<PreUsers>[] {
    return usersid.map(id => {
      return this.db.collection(collection).doc(id)
        .snapshotChanges()
        .pipe(
          map(data => {
            return Object.keys(data.payload.data());
          }),
          map(booksids =>
            new PreUsers(id, booksids)
          )
        )

    })

  }
  searchBookInCollection(collection: string, bookID: string): Observable<string[]> {
    return this.db.collection(collection, ref => ref.where(bookID, `==`, "true"))
      .snapshotChanges()
      .pipe(
        map(data => {
          return data.map(obj => {
            return obj.payload.doc.id;
          })
        }),
    )
  }
  findMatchBooksAcrossTwoRepos(wishRepo: string[], availbleRepo: Array<PreUsers>): Array<PreUsers> {
    return availbleRepo.map(data => {
      var bookarr = wishRepo.filter(element => data.booksIDs.includes(element));
      var userid = data.userid;
      return new PreUsers(userid, bookarr);
    })
  }
  validateAdress(adress: string): Observable<boolean> {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + adress + '&key=AIzaSyDvhiCtSMv0z2qTBI6BGpbf8lOBlsLFbrE')
      .map((data: any) => {
        if (data.results && data.results.length > 0)
          return data.results;
        else {
          return false;
        }
      })
  }
  checkAvailibility(bookid: string, currentuserid: string, collection: string,dist:string[]) {
    //AIzaSyDvhiCtSMv0z2qTBI6BGpbf8lOBlsLFbrE

    return this.searchBookInCollection(collection, bookid)
      .pipe(
        switchMap(userids => {
          return combineLatest(
            this.getUserBooks(userids, "wishlist")
          )
            .map((booksArr: Array<PreUsers>) =>
              ({ booksArr, currentuserid }))
        }),
        switchMap(data => {
          return this.getUserBooks(new Array(currentuserid), "usersbooks")[0].switchMap(userbooks => {
            return this.CalculateDistance2Book(this.processData(this.findMatchBooksAcrossTwoRepos(userbooks.booksIDs, data.booksArr)),dist)
          })
        }),

    )

  }
  CalculateDistance2Book(users: Observable<(User & PreUsers)[]>, cords: string[]) {
    // return combineLatest(users.switchMap(obsUser => {
    //   return obsUser.map(user => {
    //     let dist = this.getDistanceFromLatLonInKm(
    //       cords[0], cords[1], user.latitude, user.longitude);
    //     user.distance2Destination = dist;
    //     return user;
    //   })

    // })
    // )
    return combineLatest(users.switchMap(obsUser => {
      return obsUser.map(user => {
        user.distance2Destination = Math.random();
        return user;
      })

 
    }))


    // return users;
  }
  processData(usersObj: Array<PreUsers>) {
    return combineLatest(usersObj.map(user => {
      return this.getUserDetails(user.userid)

    }) 
    )
      .map(data => {
        return data.map(user => {
          return Object.assign(user, usersObj.find(y => y.userid == user.id));
        })
      })
  }
  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

 

  getUserDetails(userid: string) {
    return this.db.collection('UsersDetails', ref => ref.where('id', '==', userid))
      .snapshotChanges().concatAll()
      .map(data => {

        return data.payload.doc.data() as User;

      })


  }

  getBooksFromRepo(ids: string[]) {
    return ids.map(id => {
      return this.db.collection(`Books/`, ref => ref.where(`id`, `==`, id))
        .snapshotChanges().take(1);
    })
  }
  fetchAvailableBooksByUser(userID: string, collection: string) {
    return this.db.collection(collection + '/')
      .doc(userID)
      .snapshotChanges()
      .pipe(
        map(data => {
          return combineLatest(this.getBooksFromRepo(Object.keys(data.payload.data())));

        }),
        switchMap((data: Observable<DocumentChangeAction<{}>[][]>) => {

          return data.map(obs => {
            return obs.map(docs => {
              if (docs.length > 0) {
                return docs[0].payload.doc.data() as Book;
              }
            })
          })
        })
      )
      .subscribe(data => {
        let cleanedArr = data.filter(arr => { return arr != undefined });
        this.books = data != null ? cleanedArr : [];
        this.AvailableBooks.next([...cleanedArr]);
      })

  }

  deleteBookFromUserRepo(userid: string, bookid: string, collection: string) {
    let user = this.db.collection(collection).doc(userid);
    user.update({ [bookid]: firestore.FieldValue.delete() });
  }
  addBookToMyRepoService(userId: string, bookID: string, collection: string) {

    this.db.collection(collection)
      .doc(userId)
      .update({ [bookID]: "true" })
      .then(success => {
        console.log(success);
      })
  }   

  getAutoComplete(value: string) {

    return this.booksRepo.filter(option => option.name.toLowerCase().includes(value));

  }
  getBooksArr() {
    return this.booksRepo;
  }

  searchBookByID(bookID: string) {
    let arr: string[] = [];
    return this.db.collection(`Books`, ref => ref.where('id', '==', bookID))
      .snapshotChanges()
      .map(doc => {
        return doc.map(book => {
          return book.payload.doc.data() as Book;
        })
      })

  }

  getUserIds(bookname: string): Observable<DocumentChangeAction<DocumentData>[]> {
    //get from firebase book collection specific book object and map it to observble of objects that contains users id's.

    return this.db.collection(`BooksRepo/`, ref => ref.where('id', '==', bookname))
      .snapshotChanges()
      .map(data => {
        let id = data[0].payload.doc.id
        return id;

      })
      .switchMap(id => {
        return this.db.collection(`BooksWish`).doc(id).collection(`users`)
          .snapshotChanges()

      })

  }

  getMapedUsers(arr) {
    let users: User[] = [];
    arr.forEach(data => {
      let user = data.payload.data() as User;
      if (user != null)
        users.push(user);
    });
    return users;
  }

  // getUsers(users: DocumentChangeAction<DocumentData>[]) {
  //   let g:AngularFirestoreCollection<{}>= this.db.collection(`UsersDetails`);

  //   let users$: Array<Observable<DocumentChangeAction<DocumentData>[]>> = [];
  //   users.forEach((k  , i) => {
  //     users$.push(this.db.collection(`/UsersDetails/`).doc( k.payload.doc.id).collection('MyBooks',ref => ref.where('id','==','1234')).snapshotChanges());
  //   });
  //   return users$;
  // }





  // getUsersByBook(bookname: string) {
  //   let users$ = this.getUserIds(bookname).pipe(
  //     switchMap((data) =>
  //       combineLatest(this.getUsersByIds(data)),
  //     ),
  //     map(res =>
  //       [this.getMapedUsers(res)])
  //   );
  //   users$.subscribe(
  //     val => {        
  //       let user = val as Array<User[]>;
  //       // console.log(`Book name:${book.name} Book style:${book.style}`);
  //       // console.log(`Users:`);
  //       console.log(val[1]);
  //     },
  //     err => console.error(err),
  //     () => console.log('http completed')
  //   )

  // }


  // getUsersByIds(users: DocumentChangeAction<DocumentData>[]) {
  //   let users$: Array<Observable<Action<DocumentSnapshot<{}>>>> = [];
  //   users.forEach((k  , i) => {
  //     users$.push(this.db.doc(`/UsersDetails/` + Object.keys(k.payload.doc.data())[0]).snapshotChanges());
  //   });
  //   return users$;
  // }
}