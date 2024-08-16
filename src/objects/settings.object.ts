export class SettingsObject {
   id: number = 0;

   credit_renewal_minute!: number;
   device_create_per_login!: number;

   user_work_interval!: number;

   user_max_follow!: number;
   user_max_watch!: number;
   user_max_like!: number;
   user_max_comment!: number;
   user_max_retweet!: number;

   user_follow_credit!: number;
   user_like_credit!: number;
   user_comment_credit!: number;
   user_watch_credit!: number;
   user_retweet_credit!: number;

   sent_req_interval!: number;

   max_follow_thread!: number;
   max_like_thread!: number;
   max_comment_thread!: number;
   max_watch_thread!: number;
   max_retweet_thread!: number;

   default_pool_datamodel!: number
}