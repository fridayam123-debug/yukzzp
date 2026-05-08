import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('renders brand name and reservation CTA', () => {
    render(<Header />)
    expect(screen.getByText('육즙관리소')).toBeInTheDocument()
    expect(screen.getByText('예약하기')).toBeInTheDocument()
  })
})
