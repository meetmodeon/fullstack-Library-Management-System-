// import { Injectable } from '@angular/core';
// import { WebSocketServicProgramService } from '../../socket/websocketProgram/web-socket-servic-program.service';
// import { AnnouncementResponse } from '../../models';
// import { AnnouncementType } from '../../../core/page/notification/notification.component';

// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationService {
//   // private notifyCache=new Map<number,AnnouncementResponse>()
//   groupedByType: Record<AnnouncementType, AnnouncementResponse[]> = {
//     NEW_BOOK: [],
//     BOOK_DUE: [],
//     MEETING: [],
//     MILESTONE: [],
//   };

//   constructor(private webService: WebSocketServicProgramService) {}
  

//   loadAllNotification(): void {
//     this.webService.allNotification$.subscribe((notifications) => {
//       this.groupedByType = {
//         NEW_BOOK: [],
//         BOOK_DUE: [],
//         MEETING: [],
//         MILESTONE: [],
//       };
//       notifications.forEach((n) => {
//         if (!this.groupedByType[n.type as AnnouncementType]) {
//           this.groupedByType[n.title as AnnouncementType] = [];
//         }
//         this.groupedByType[n.type as AnnouncementType].push(n);
//       });
//       console.log("notification data is: ",notifications)
//     });
//   }
//   getNotificationByType(type: AnnouncementType): AnnouncementResponse[] {
//     return this.groupedByType[type] ?? [];
//   }
// }
