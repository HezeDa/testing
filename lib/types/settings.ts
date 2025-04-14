export interface Settings {
  id?: number
  site_name: string
  meta_description: string
  meta_keywords: string
  maintenance_mode: boolean
  contact_email: string
  contact_phone: string
  address: string
  working_hours: string
  facebook_url: string | null
  instagram_url: string | null
  whatsapp_number: string | null
  header_phone: string
  header_email: string
  show_social_in_header: boolean
  footer_description: string | null
  footer_copyright: string | null
  show_social_in_footer: boolean
  show_contact_in_footer: boolean
  show_working_hours_in_footer: boolean
  created_at?: string
  updated_at?: string
} 