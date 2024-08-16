export class CustomerObject {
    declare key: number;
    role_id?: number;
    is_bot: boolean|undefined;
    declare username: string;
    email: string|undefined;
    spam_status: number|undefined;
    credit_follow: number|undefined;
    credit_like: number|undefined;
    credit_comment: number|undefined;
    credit_watch: number|undefined;
    credit_retweet: number|undefined;
    account_info: Object | undefined;
    error_log: string | undefined;
}