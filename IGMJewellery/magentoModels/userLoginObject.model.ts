/**
 * Object returned by the Magento API when a user logs in
 */
export interface UserLoginObject {
  customer_email: string;
  customer_id: string;
  customer_name: string;
}
