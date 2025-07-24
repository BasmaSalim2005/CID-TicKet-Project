import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { envirement } from '../../envirement';
import { Addfeedback } from '../feedback/add-feedback/addfeedback';
import { AddfeedbackRequest } from './model/add-request';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http:HttpClient ) {}
  getAllApplicationspage(page: number, size: number): Observable<any>{
     return this.http.get<any>(`${envirement.applicationService}/apps?page=${page}&size=${size}`)
  }
  getAppbyuserpage(email:string, page: number, size: number): Observable<any>{
     return this.http.get<any>(`${envirement.applicationService}/app/by-user?${email}page=${page}&size=${size}`)
  }
  getAllApplications(): Observable<any>{
     return this.http.get<any>(`${envirement.applicationService}/all`)
  }
  getAppbyuser(email:string): Observable<any>{
     return this.http.get<any>(`${envirement.applicationService}/byuser/${email}`)
  }
  getAppByName(name:string): Observable<any>{
    return this.http.get<any>(`${envirement.applicationService}/getbyname/${name}`)
  }
  addApplications(applications:any): Observable<any>{
    return this.http.post<any>(`${envirement.applicationService}/add`, applications)
  }
  totalAppsActive(): Observable<any> {
    return this.http.get(`${envirement.applicationService}/countactive`);
  }
  totalAppsDisactive(): Observable<any> {
    return this.http.get(`${envirement.applicationService}/countdisactive`);
  }
  totalAppsMaintenance(): Observable<any> {
    return this.http.get(`${envirement.applicationService}/countmaintenance`);
  }
  totalAppsActiveUser(email: String): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get(`${envirement.applicationService}/active/byuser/`, { params });
  }
  totalAppsDisactiveUser(email: String): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get(`${envirement.applicationService}/disactive/byuser`, { params });
  }
  totalAppsMaintenanceUser(email: String): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get(`${envirement.applicationService}/maintenance/byuser`, { params });
  }
  totalApps() : Observable<any>{
    return this.http.get(`${envirement.applicationService}/counttotal`)
  }
  totalAppsUser(email:String) : Observable<any>{
    return this.http.get(`${envirement.applicationService}/counttotalbydev/${email}`)
  }
  deleteApplication(id: number): Observable<any>{
    return this.http.delete(`${envirement.applicationService}/delete/${id}`)
  }
  AuthentificateUser(email: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(
      `${envirement.applicationService}/users/login`,
      body.toString(),
      { headers }
    );
  }
  addFeature(feature: any): Observable<any>{
    return this.http.post<any>(`${envirement.featureService}/add`, feature)
  }
  setApplicationActive(appName: String): Observable<any>  {
    return this.http.put<any>(`${envirement.applicationService}/activate/${appName}`, null);
  }
  setApplicationDisactive(appName: String): Observable<any> {
    return this.http.put<any>(`${envirement.applicationService}/disactivate/${appName}`, null);
  }
  setApplicationMaintenance(appName: String): Observable<any> {
    return this.http.put<any>(`${envirement.applicationService}/inmaintenance/${appName}`, null);
  }
  getFeaturesByAppName(appName: String): Observable<any> {
    const params = new HttpParams().set('appName', appName as string);
    return this.http.get<any>(`${envirement.featureService}/getbyapp/`, { params });
  }
  editApplication(id: number, updatedFields: any): Observable<any> {
    return this.http.put<any>(`${envirement.applicationService}/update/${id}`, updatedFields);
  }
  deleteFeature(featureId: number): Observable<any> {
    return this.http.delete<any>(`${envirement.featureService}/delete/${featureId}`);
  }
  editFeature(featureId: number, updatedFields: any): Observable<any> {
    return this.http.put<any>(`${envirement.featureService}/update/${featureId}`, updatedFields);
  }
  getAllDevelopers(): Observable<any> {
    return this.http.get<any>(`${envirement.applicationService}/users/getdev`);
  }
  addUserToApp(email: string, appName: string): Observable<any> {
    return this.http.post<any>(`${envirement.applicationService}/user/add?email=${email}&name=${appName}`, {});
  }
  getTicketsByUser(email: string): Observable<any> {
    return this.http.get<any>(`${envirement.ticketService}/getbyemail/${email}`);
  }
  getTicketById(id: number): Observable<any> {
    return this.http.get<any>(`${envirement.ticketService}/getbyid/${id}`);
  }
  addTicket(ticket: any): Observable<any> {
    return this.http.post<any>(`${envirement.ticketService}/add`, ticket);
  }
  editTicket(ticketId: number, updatedFields: any): Observable<any> {
    return this.http.put<any>(`${envirement.ticketService}/update/${ticketId}`, updatedFields);
  }
  deleteTicket(ticketId: number): Observable<any> {
    return this.http.delete<any>(`${envirement.ticketService}/delete/${ticketId}`);
  }
  countApproved(email: string): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get<any>(`${envirement.ticketService}/count/approve`, {params});
  }
  countSolved(email: string): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get<any>(`${envirement.ticketService}/count/solve`, {params});
  }
  countInprogress(email: string): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get<any>(`${envirement.ticketService}/count/inprogress`, {params});
  }
  countAssigned(email: string): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get<any>(`${envirement.ticketService}/count/assigne`, {params});
  }
  countClosed(email: string): Observable<any> {
    const params = new HttpParams().set('email', email as string);
    return this.http.get<any>(`${envirement.ticketService}/count/close`, {params});
  }
  countCancelled(email: string): Observable<any> {
    const params = new HttpParams().set('email', email as string);   
    return this.http.get<any>(`${envirement.ticketService}/count/cancel`, {params});
  }
  closeTicket(id: number): Observable<any> {
    return this.http.get<any>(`${envirement.ticketService}/close/${id}`);
  }
  approveTicket(id: number): Observable<any> {
    return this.http.get<any>(`${envirement.ticketService}/approve/${id}`);
  }
  addFeedback(request:AddfeedbackRequest): Observable<any> {
    return this.http.post<any>(`${envirement.feedbackService}/add`, request);
  }
}
