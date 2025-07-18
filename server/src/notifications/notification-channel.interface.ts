export interface INotificationChannel {
  send(to: string, message: string, payload: any): Promise<void>;
}
