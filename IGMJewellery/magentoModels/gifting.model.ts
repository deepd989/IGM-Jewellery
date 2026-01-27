export interface GiftCardTemplateFields {
  sender: string;
  recipient: string;
  message: string;
}

export interface GiftCard {
  giftcard_id: string;
  code: string;
  pattern: string | null;
  init_balance: string; // Stored as string to preserve precision
  balance: string;
  status: string; // Usually '1' for Active, '0' for Inactive
  can_redeem: string;
  store_id: string;
  pool_id: string | null;
  template_id: string;
  image: string;
  template_fields: GiftCardTemplateFields;
  customer_ids: string | null;
  order_item_id: string | null;
  order_increment_id: string | null;
  delivery_method: string;
  delivery_address: string;
  is_sent: string;
  delivery_date: string | null;
  timezone: string;
  extra_content: string | null;
  expired_at: string | null;
  created_at: string;
  // title is missing
  // senderName missing
  //senderPhone missing
  // gift message is missing
  // date -> schedule date missing
}

export interface sendGiftCardPayload {
  // Whole interface is missing
  // receiverId: string;
  // amount: number;
  // message: string;
  // senderName: string;
  // senderPhone: number;
}

export interface SearchCriteria {
  filter_groups: any[]; // Replace 'any' with specific filter interface if needed
  page_size: number;
  current_page: number;
}

export interface GiftCardResponse {
  items: GiftCard[];
  search_criteria: SearchCriteria;
  total_count: number;
}
