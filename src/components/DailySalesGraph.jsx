import React from 'react';

const DailySalesGraph = () => {
  // 15 days of dummy sales data
  const salesData = [15, 22, 18, 25, 20, 28, 32, 24, 19, 21];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

  // Convert sales to lakhs and calculate max value for Y-axis
  const maxSales = Math.ceil(Math.max(...salesData) / 10) * 10;
  const yAxisTicks = Array.from({ length: 5 }, (_, i) => (maxSales / 4) * i);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#366532' }}>Daily Sales (Last 10 Days)</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Y-axis */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '50px', height: '200px', paddingBottom: '25px' }}>
          {yAxisTicks.reverse().map((tick) => (
            <div key={tick} style={{ fontSize: '0.75rem', color: '#666', textAlign: 'right', paddingRight: '8px' }}>
              {(tick / 100).toFixed(2)}L
            </div>
          ))}
        </div>
        {/* Graph area */}
        <div style={{ 
          flex: 1,
          display: 'flex', 
          alignItems: 'flex-end', 
          height: '200px',
          position: 'relative',
          paddingBottom: '25px',
          borderBottom: '1px solid #e0e0e0',
          borderLeft: '1px solid #e0e0e0',
          backgroundImage: 'linear-gradient(#f5f5f5 1px, transparent 1px)',
          backgroundSize: '100% 50px'
        }}>
          {salesData.map((sales, index) => {
            const barHeight = (sales / maxSales) * 180;

            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: `${barHeight}px`,
                    backgroundColor: '#366532',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    ':hover': {
                      backgroundColor: '#2b4f27',
                      transform: 'scaleY(1.02)'
                    }
                  }}
                  title={`${sales/100} lakhs`}
                />
                <div style={{ 
                  position: 'absolute',
                  top: `-25px`,
                  fontSize: '0.875rem',
                  color: '#366532',
                  fontWeight: '500'
                }}>
                  {(sales/100).toFixed(2)}L
                </div>
                <div style={{ 
                  marginTop: '8px',
                  fontSize: '0.75rem',
                  color: '#666'
                }}>
                  {days[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailySalesGraph;