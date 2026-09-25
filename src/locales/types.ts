import { SupportedLocale } from '../types/bi';

export interface TranslationDictionary {
  nav: {
    dashboard: string;
    my_business: string;
    manage_affairs: string;
    analyze: string;
    data: string;
    insights: string;
    charts: string;
    recommendations: string;
    impact: string;
    decision: string;
    methodology: string;
    settings: string;
  };
  navSublabels: {
    dashboard: string;
    my_business: string;
    manage_affairs: string;
    analyze: string;
    data: string;
    insights: string;
    charts: string;
    recommendations: string;
    impact: string;
    decision: string;
    methodology: string;
    settings: string;
  };
  common: {
    continue: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add_record: string;
    skip: string;
    back: string;
    search: string;
    no_data_yet: string;
    level: string;
    operating_tier: string;
    privacy_guaranteed: string;
    close: string;
    filter: string;
    status: string;
    date: string;
    actions: string;
  };
  auth: {
    title: string;
    subtitle: string;
    description: string;
    continue_google: string;
    google_session_note: string;
    privacy_note: string;
    core_principle: string;
    security_badge: string;
  };
  language: {
    choose_language: string;
    choose_language_desc: string;
    search_language: string;
    current_language: string;
    select_and_continue: string;
  };
  setup: {
    title: string;
    subtitle: string;
    business_name: string;
    business_name_placeholder: string;
    business_type: string;
    business_level: string;
    location: string;
    location_placeholder: string;
    primary_offerings: string;
    primary_offerings_placeholder: string;
    continue_to_dashboard: string;
    skip_optional: string;
    privacy_promise: string;
  };
  affairs: {
    title: string;
    subtitle: string;
    sales: string;
    sales_desc: string;
    products: string;
    products_desc: string;
    inventory: string;
    inventory_desc: string;
    customers: string;
    customers_desc: string;
    expenses: string;
    expenses_desc: string;
    orders: string;
    orders_desc: string;
    suppliers: string;
    suppliers_desc: string;
    employees: string;
    employees_desc: string;
    tasks: string;
    tasks_desc: string;
    documents: string;
    documents_desc: string;
    level_relevance: string;
    empty_state_sub: string;
    no_records_added: string;
    add_sale: string;
    edit_sale: string;
    add_product: string;
    edit_product: string;
    add_customer: string;
    edit_customer: string;
    add_expense: string;
    edit_expense: string;
    add_order: string;
    edit_order: string;
    add_supplier: string;
    edit_supplier: string;
    add_task: string;
    edit_task: string;
    add_document: string;
    edit_document: string;
    margin_disclaimer: string;
    stock_in: string;
    stock_low: string;
    stock_out: string;
    analytics_sync_prompt: string;
    analytics_sync_button: string;
  };
  dashboard: {
    total_sales: string;
    total_expenses: string;
    number_of_products: string;
    low_stock_items: string;
    pending_orders: string;
    customer_count: string;
    no_data_metric: string;
  };
  my_business: {
    title: string;
    subtitle: string;
    edit_profile: string;
    save_changes: string;
    cancel_edit: string;
    profile_details: string;
    tier_focus_title: string;
    tier_focus_desc: string;
    established_date: string;
    data_governance: string;
  };
  settings: {
    title: string;
    subtitle: string;
    active_language: string;
    active_profile: string;
    auth_status: string;
    clear_data: string;
    switch_account: string;
  };
  levels: {
    local_village: string;
    city_growing: string;
    international_global: string;
  };
}

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction?: 'ltr' | 'rtl';
}
