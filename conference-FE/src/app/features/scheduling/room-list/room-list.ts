import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchedulingService, Room } from '../../../services/scheduling'; 

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      
      <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 class="font-semibold text-lg text-blueGray-700">Room Management</h3>
          </div>
          <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button (click)="showForm = !showForm" 
              class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
              {{ showForm ? 'Cancel' : '+ New Room' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="showForm" class="p-4 bg-blueGray-50">
        <form (ngSubmit)="createRoom()">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" [(ngModel)]="newRoom.name" name="name" placeholder="Room Name (e.g. Hall A)" class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
            <input type="text" [(ngModel)]="newRoom.location" name="location" placeholder="Location (e.g. Building 1)" class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
            <input type="number" [(ngModel)]="newRoom.capacity" name="capacity" placeholder="Capacity" class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
          </div>
          <button type="submit" class="mt-4 bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1">
            Save Room
          </button>
        </form>
      </div>

      <div class="block w-full overflow-x-auto">
        <table class="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Name</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Location</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Capacity</th>
              <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let room of rooms">
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold">{{ room.name }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{{ room.location }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{{ room.capacity }}</td>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                <button (click)="deleteRoom(room.room_id!)" class="text-red-500 font-bold uppercase text-xs px-2 py-1">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RoomListComponent {
  private schedulingService = inject(SchedulingService);
  
  rooms: Room[] = [];
  showForm = false;
  newRoom: Room = { name: '', location: '', capacity: 0 };

  constructor() {
    this.loadRooms();
  }

  loadRooms() {
    this.schedulingService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  createRoom() {
    if(this.newRoom.name) {
      this.schedulingService.createRoom(this.newRoom).subscribe(() => {
        this.loadRooms();
        this.showForm = false;
        this.newRoom = { name: '', location: '', capacity: 0 }; // Reset form
      });
    }
  }

  deleteRoom(id: number) {
    if(confirm('Are you sure?')) {
      this.schedulingService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
      });
    }
  }
}