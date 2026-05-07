import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from '@/components/layout/Footer'

const mockLocs = [
  { slug: 'yangjae', name_ko: '육즙관리소 양재역점', address_road: '서울 강남구 강남대로44길 7', virtual_phone: '0507-1335-6363' },
  { slug: 'euljiro', name_ko: '육즙관리소 더룸 을지로동대문점', address_road: '서울 중구 을지로43길 7', virtual_phone: '0507-1461-7228' },
] as any

describe('Footer', () => {
  it('renders both locations and brand', () => {
    render(<Footer locations={mockLocs} />)
    expect(screen.getByText('육즙관리소 양재역점')).toBeInTheDocument()
    expect(screen.getByText('육즙관리소 더룸 을지로동대문점')).toBeInTheDocument()
    expect(screen.getByText('육즙관리소')).toBeInTheDocument()
  })
})
