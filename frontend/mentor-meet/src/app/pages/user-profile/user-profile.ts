import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  user: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Az 'id' paramétert az app.routes.ts-ben definiált :id-ból vesszük
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.http.get(`/api/get_user_details.php?id=${id}`)
        .subscribe({
          next: (data) => {
            this.user = data;
            this.loading = false;
          },
          error: (err) => {
            console.error('Hiba a profil betöltésekor', err);
            this.loading = false;
          }
        });
    }
  }

  goBack() {
    window.history.back();
  }

}
