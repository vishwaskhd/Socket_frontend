import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'enviroment';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    login(name: string, password: string) {
        // Replace 'your-api-endpoint' with your actual API endpoint
        return this.http.post<any>(`${environment.BASE_URL}/login`, { name, password });
    }

    getConversations() {
        return this.http.get<any>(`${environment.BASE_URL}/get_all_users`)
    }

    getUser() {
        const user: any = localStorage.getItem("user");
        if (user) {
            return JSON.parse(user)
        }
        return;
    }

    getChatHistory(roomId: any) {
        return this.http.get<any>(`${environment.BASE_URL}/get_all_messages_by_room?room_id=${roomId}`)
    }
}
