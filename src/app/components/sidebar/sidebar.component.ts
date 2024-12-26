import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarOpen = false;

      // Variable to control the sidebar state (open or closed)
 
  // Function to toggle the sidebar visibility
  toggleSidebar() {
    console.log("toggle clicked")
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
