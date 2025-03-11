// Name: Resize
// Method: Static
// Desc: Registers callbacks to be executed whenever the window is resized, providing the updated width and height. <br> This is useful for dynamic layouts, responsive design adjustments, or recalculating dimensions based on the window size. <br> Each registered callback will receive the current window width and height, and multiple callbacks can be added to handle different aspects of resizing.
// Type: Event Handling
// Usage:
//   // Responsive layout adjustments
//   Q.Resize((width, height) => {
//       const sidebar = document.querySelector('.sidebar');
//       sidebar.style.display = width < 768 ? 'none' : 'block';
//   });
//   
//   // Dynamic font sizing
//   Q.Resize((width, height) => {
//       const baseFontSize = Math.max(14, Math.min(18, width / 100));
//       document.documentElement.style.fontSize = `${baseFontSize}px`;
//   });
//   
//   // Canvas resizing
//   Q.Resize((width, height) => {
//       const canvas = document.querySelector('canvas');
//       canvas.width = width;
//       canvas.height = height * 0.8;
//       redrawCanvas();
//   });
// Variables: callbacks, width, height, callback
Q.Resize=((c)=>{
    addEventListener("resize",()=>{
      for(let i=0,l=c.length;i<l;) c[i++](innerWidth,innerHeight)
    });
    return f=>c.push(f)
  })([])
