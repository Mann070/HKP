import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Milk, Wine, Package, Box, Droplet, Gift, Waves, 
  Utensils, Smile, Baby, ShoppingBag, Shirt, Bed, 
  Paintbrush, Puzzle
} from 'lucide-react';

const colorThemes = [
  { cardBg: '#FCF1E8', iconBg: '#E6C6B0' }, 
  { cardBg: '#FCE1E3', iconBg: '#E39A9F' }, 
  { cardBg: '#FBD5DA', iconBg: '#E88C96' }, 
  { cardBg: '#E2F4F4', iconBg: '#A8D8D8' }, 
  { cardBg: '#A8E3E5', iconBg: '#60C8CB' }, 
  { cardBg: '#CADAE8', iconBg: '#88A8C2' }, 
  { cardBg: '#E6F3E7', iconBg: '#A8C9AB' }, 
  { cardBg: '#F2EBF4', iconBg: '#D1BFD5' }, 
  { cardBg: '#FBD1E4', iconBg: '#E686AD' }, 
  { cardBg: '#DDC8E3', iconBg: '#B48AC2' }, 
  { cardBg: '#E1F4FD', iconBg: '#A8D8E8' }, 
  { cardBg: '#B1D1EF', iconBg: '#70A5DB' }, 
  { cardBg: '#E6E8E9', iconBg: '#B0B8B9' }, 
  { cardBg: '#E1E3E5', iconBg: '#9EA3A8' }  
];

const getIconByName = (name) => {
  const n = name.toLowerCase();
  
  if (n.includes('bottle') || n.includes('sipper')) return Milk;
  if (n.includes('food') || n.includes('container') || n.includes('powder') || n.includes('box')) return Box;
  if (n.includes('toy') || n.includes('rattle')) return Puzzle;
  if (n.includes('bath') || n.includes('towel') || n.includes('wipe')) return Waves;
  if (n.includes('spoon') || n.includes('silicon')) return Utensils;
  if (n.includes('comb') || n.includes('brush')) return Paintbrush;
  if (n.includes('diaper') || n.includes('cloth') || n.includes('wear') || n.includes('cap') || n.includes('hat')) return Shirt;
  if (n.includes('bag')) return ShoppingBag;
  if (n.includes('bed') || n.includes('blanket')) return Bed;
  if (n.includes('teether') || n.includes('soother')) return Smile;
  if (n.includes('gift')) return Gift;
  
  return Baby;
};

export default function CategoryCard({ category, index = 0 }) {
  const Icon = getIconByName(category.name);
  const theme = colorThemes[index % colorThemes.length];

  return (
    <Link to={`/category/${category._id}`} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <div 
        style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.iconBg}`,
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
        }}
      >
        <div style={{
          backgroundColor: theme.iconBg,
          color: '#2D2D2D',
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <h3 style={{ 
          fontSize: '17px', 
          fontWeight: 600, 
          color: '#1F2937',
          letterSpacing: '0.3px',
          margin: 0
        }}>
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
