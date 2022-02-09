import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filter } from '../models/filter';
import { Item } from '../models/item';
import { ItemPayload } from '../models/itemPayload';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

/*const mock_items:ItemPayload = {
  items: [
    {id: 1, name: 'Adidas Stan Smith', price: 90.0, category: 'Shoes', description: ''},
    {id: 2, name: 'Nike Air Max', price: 110.0, category: 'Shoes', description: ''},
    {id: 3, name: 'Reebok Sweat Shirt', price: 45.0, category: 'Clothes', description: ''},
    {id: 4, name: 'Puma T-Shirt', price: 30.0, category: 'Clothes', description: ''},
    {id: 5, name: 'Under Armour', price: 130.0, category: 'Shoes', description: ''},
    {id: 6, name: 'Nike Sweat shirt', price: 65.0, category: 'Clothes', description: ''},
    {id: 7, name: 'Spalding basketball', price: 43.0, category: 'Gear', description: ''},
    {id: 8, name: 'Dumbbell 5kg', price: 3.50, category: 'Gear', description: ''},
    {id: 9, name: 'New Balance', price: 120.0, category: 'Shoes', description: ''}
  ],
  count: 8
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {
 
  getItems(page:number, pageSize:number, filter:Filter): Observable<ItemPayload> {
    let filteredItems:Item[] = mock_items.items.filter(item => 
        { 
          return (
            item.name.indexOf(filter.name) >= 0 
            && 
            (filter.categories.length == 0 || filter.categories.includes(item.category) ) 
          );
        }
      );

    let payload:ItemPayload = {
      items: filteredItems.slice((page-1)*pageSize, page*pageSize),
      count: filteredItems.length
    }
    return of(payload);
  }

  getItem(id:number): Observable<Item>{
    return of(mock_items.items[id]);
  }
  
  constructor() { }
}*/


@Injectable({
  providedIn: 'root'
})
export class ItemService {
 
  itemsUrl = `${environment.apiUrl}/items`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getItems(page:number, pageSize:number, filter:Filter): Observable<ItemPayload>{
    let categoriesString:string = "";
    filter.categories.forEach(cc => categoriesString = categoriesString  + cc + "#");
    if(categoriesString.length > 0)
      categoriesString = categoriesString.substring(0, categoriesString.length -1);

    let params = new HttpParams()
              .set("name", filter.name)
              .set("pageNumber", page.toString())
              .set("pageSize", pageSize.toString())
              .set("category", categoriesString);

    return this.http.get<ItemPayload>(this.itemsUrl, {params: params})
              .pipe(catchError(this.handleError<ItemPayload>('getItems', {items:[], count:0} )));
  }

  getItem(id: number): Observable<Item> {
    const url = `${this.itemsUrl}/${id}`;
    return this.http.get<Item>(url)
              .pipe(catchError(this.handleError<Item>(`getItem/${id}`, {id:0, name:"", price:0, category:"", description:""})));
  }
  
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any) : Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }

  constructor(private http: HttpClient) { }
}