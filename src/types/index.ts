export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: {
    front: string
    back: string
  }
  category: 'club' | 'national'
  team?: string
  season?: string
  type?: 'home' | 'away' | 'third'
  stock?: number
  sizes?: string[]
  colors?: string[]
  is_personalized?: boolean
  is_best_seller?: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: Address
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  size: string
  price: number
  product?: Product
}

export interface Address {
  street: string
  city: string
  postal_code: string
  country: string
}

export interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  default_address?: Address
  created_at: string
  updated_at: string
}
