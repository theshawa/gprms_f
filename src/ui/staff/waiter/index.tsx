import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { FC } from "react";
import { useNavigate } from 'react-router-dom';


// Sample data array
const cardData = [
  {
    id: 1,
    orderCount: 0
  },
  {
    id: 2,
    orderCount: 7
  },
  {
    id: 3,
    orderCount: 1
  },
  {
    id: 4,
    orderCount: 0
  },
  {
    id: 5,
    orderCount: 2
  },
  {
    id: 6,
    orderCount: 8
  },
  {
    id: 7,
    orderCount: 0
  },
  {
    id: 8,
    orderCount: 6
  },
  {
    id: 9,
    orderCount: 3
  },
  {
    id: 10,
    orderCount: 0
  },
  {
    id: 11,
    orderCount: 2
  },
  {
    id: 12,
    orderCount: 0
  },
  {
    id: 13,
    orderCount: 1
  },
  {
    id: 14,
    orderCount: 7
  },
  {
    id: 15,
    orderCount: 0
  },
  {
    id: 16,
    orderCount: 6
  },
  {
    id: 17,
    orderCount: 0
  },
  {
    id: 18,
    orderCount: 8
  },
  {
    id: 19,
    orderCount: 2
  },
  {
    id: 20,
    orderCount: 0
  },
  {
    id: 21,
    orderCount: 9
  },
  {
    id: 22,
    orderCount: 0
  },
  {
    id: 23,
    orderCount: 7
  },
  {
    id: 24,
    orderCount: 0
  },
  {
    id: 25,
    orderCount: 6
  },
  {
    id: 26,
    orderCount: 3
  },
  {
    id: 27,
    orderCount: 0
  },
  {
    id: 28,
    orderCount: 2
  },
  {
    id: 29,
    orderCount: 0
  },
  {
    id: 30,
    orderCount: 1
  },
  {
    id: 31,
    orderCount: 0
  },
  {
    id: 32,
    orderCount: 4
  },
  {
    id: 33,
    orderCount: 0
  },
  {
    id: 34,
    orderCount: 9
  },
  {
    id: 35,
    orderCount: 0
  },
  {
    id: 36,
    orderCount: 8
  },
  {
    id: 37,
    orderCount: 2
  },
  {
    id: 38,
    orderCount: 0
  },
  {
    id: 39,
    orderCount: 1
  },
  {
    id: 40,
    orderCount: 0
  }
];



export const Waiter_HomePage: FC = () => {

  const navigate = useNavigate();

  const handleTableClick = (tableId: number) => {
    navigate(`/staff/waiter/table/${tableId}`);
  }

  return (
    <Box className="grid grid-cols-4 gap-2 p-2 w-full sm:gap-3 sm:p-3 md:gap-4 md:p-4 lg:grid-cols-5 xl:grid-cols-6">
      {cardData.map((card) => (
        <div key={card.id} className="relative">
          <Card 
            className='w-full min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[130px] transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:scale-105 cursor-pointer'
            sx={{ 
              backgroundColor: card.orderCount > 0 ? '#009688' : 'inherit',
              opacity: card.orderCount > 0 ? 1 : 1
            }}
            onClick={() => handleTableClick(card.id)}
          >
            <CardContent className='p-1 sm:p-2 md:p-3 text-center flex items-center justify-center h-full'>
              <Typography
                className='text-xs sm:text-sm md:text-base font-medium'
                sx={{ 
                  color: card.orderCount > 0 ? 'white' : 'text.secondary'
                }}
              >
                {card.id}
              </Typography>
            </CardContent>
          </Card>
          
          {/* Order count badge - only show if there are orders */}
          {card.orderCount > 0 && (
            <Typography
            className='absolute top-1 right-1 sm:top-2 sm:right-2 bg-white text-red-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[2px] sm:text-[4px] font-bold shadow-md border-2 border-gray-100'
            component="div"
            >
              {card.orderCount}
            </Typography>
          )}
        </div>
      ))}
    </Box>
  );
};