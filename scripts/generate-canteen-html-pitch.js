const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FoodLine Campus — Canteen Revenue & Growth Pitch</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #07070B;
      color: #F5F5F7;
      overflow-x: hidden;
    }
    h1, h2, h3, .font-heading {
      font-family: 'Outfit', sans-serif;
    }
    .slide {
      display: none;
      animation: fadeIn 0.35s ease-in-out;
    }
    .slide.active {
      display: flex;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .glass-card {
      background: rgba(18, 18, 26, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .glow-green {
      box-shadow: 0 0 35px rgba(0, 212, 170, 0.15);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between p-4 md:p-8 select-none">

  <!-- TOP BRAND HEADER -->
  <header class="max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-white/10 mb-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] p-0.5 flex items-center justify-center">
        <div class="w-full h-full bg-[#07070B] rounded-[10px] flex items-center justify-center font-black text-[#00D4AA] text-lg">
          FL
        </div>
      </div>
      <div>
        <span class="font-black text-xl tracking-tight bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] bg-clip-text text-transparent">FoodLine Campus</span>
        <span class="text-xs text-emerald-400 font-bold ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">Canteen Growth Partner</span>
      </div>
    </div>
    <div class="text-xs font-bold text-zinc-400">
      Slide <span id="slide-num" class="text-emerald-400 font-black text-sm">1</span> of 10
    </div>
  </header>

  <!-- SLIDE CONTAINER -->
  <main class="max-w-6xl mx-auto w-full flex-1 flex items-center justify-center my-auto">

    <!-- SLIDE 1: Cover -->
    <div class="slide active flex-col w-full glass-card rounded-3xl p-8 md:p-12 glow-green">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-6 w-fit">
        <span>📈 Canteen Revenue & Profit Pitch</span>
      </div>
      <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
        Double Your Daily Canteen Sales &<br/>
        <span class="bg-gradient-to-r from-[#00D4AA] via-emerald-300 to-[#FFB347] bg-clip-text text-transparent">Eliminate Break-Time Queue Losses</span>
      </h1>
      <p class="text-lg text-zinc-300 mb-8 max-w-3xl">
        FoodLine Campus is the #1 Express Pre-Ordering & Kitchen Automation System built specifically for campus canteen owners to serve 3x more meals without adding kitchen staff.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-black/40 border border-emerald-500/20">
        <div>
          <div class="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Peak Capacity</div>
          <div class="text-2xl font-black text-emerald-400">3x - 4x Orders</div>
          <div class="text-xs text-zinc-400">Serve 500+ meals per recess</div>
        </div>
        <div>
          <div class="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Payment Security</div>
          <div class="text-2xl font-black text-emerald-400">100% Guaranteed</div>
          <div class="text-xs text-zinc-400">12-Digit UTR Verification</div>
        </div>
        <div>
          <div class="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Upfront Investment</div>
          <div class="text-2xl font-black text-emerald-400">₹0 Free Setup</div>
          <div class="text-xs text-zinc-400">Free KDS & Staff Training</div>
        </div>
      </div>
    </div>

    <!-- SLIDE 2: The Problem -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">The Rush-Hour Crisis</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">Where Is Your Canteen Losing Money Every Single Day?</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-red-950/30 border border-red-500/30">
          <div class="text-3xl mb-3">🔴</div>
          <h3 class="text-lg font-bold text-red-400 mb-2">60% Student Turnback</h3>
          <p class="text-sm text-zinc-300">With only 15-20 minutes of break time, over half the students skip buying food because counter queues are 25+ students deep.</p>
        </div>
        <div class="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30">
          <div class="text-3xl mb-3">🟠</div>
          <h3 class="text-lg font-bold text-amber-400 mb-2">Counter Bottleneck</h3>
          <p class="text-sm text-zinc-300">Manual cash exchanges and scanning QR codes eats up 45 seconds per student. You can only serve ~150 meals per break maximum.</p>
        </div>
        <div class="p-6 rounded-2xl bg-red-950/30 border border-red-500/30">
          <div class="text-3xl mb-3">🔴</div>
          <h3 class="text-lg font-bold text-red-400 mb-2">Fake Screenshot Losses</h3>
          <p class="text-sm text-zinc-300">Staff cannot check every bank account statement during peak rush. Old/fake UPI payment screenshots cause 5-10% daily revenue leakage.</p>
        </div>
      </div>
    </div>

    <!-- SLIDE 3: The Solution -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">The FoodLine Solution</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">Transform Your Canteen into a 30-Sec Express Station</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-black/40 border border-emerald-500/20">
          <div class="text-3xl font-black text-emerald-400 mb-2">01</div>
          <h3 class="font-bold text-white mb-1">Pre-Orders in Class</h3>
          <p class="text-xs text-zinc-400">Students order & pay via UPI 15 mins before break bell rings.</p>
        </div>
        <div class="p-5 rounded-2xl bg-black/40 border border-emerald-500/20">
          <div class="text-3xl font-black text-emerald-400 mb-2">02</div>
          <h3 class="font-bold text-white mb-1">Instant Kitchen Alert</h3>
          <p class="text-xs text-zinc-400">Orders appear on Kitchen Display Screen sorted by prep time.</p>
        </div>
        <div class="p-5 rounded-2xl bg-black/40 border border-emerald-500/20">
          <div class="text-3xl font-black text-emerald-400 mb-2">03</div>
          <h3 class="font-bold text-white mb-1">Batch Preparation</h3>
          <p class="text-xs text-zinc-400">Chef prepares exact dish quantities hot & fresh before break.</p>
        </div>
        <div class="p-5 rounded-2xl bg-black/40 border border-emerald-500/20">
          <div class="text-3xl font-black text-emerald-400 mb-2">04</div>
          <h3 class="font-bold text-white mb-1">30-Sec Express Pass</h3>
          <p class="text-xs text-zinc-400">Student scans optical QR pass at counter and collects hot meal.</p>
        </div>
      </div>
    </div>

    <!-- SLIDE 4: Profit Pillar 1 -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Canteen Profit Pillar #1</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">Serve 3x More Meals With Same Kitchen Staff</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
          <h3 class="text-lg font-bold text-red-400 mb-3">WITHOUT FOODLINE</h3>
          <ul class="space-y-2 text-sm text-zinc-300">
            <li>• Maximum ~150-180 orders served per recess</li>
            <li>• Physical counter bottleneck stops sales</li>
            <li>• Long wait times frustrate students</li>
            <li>• Unsold food wasted if prepared specs fail</li>
            <li class="font-bold text-red-400 pt-2 border-t border-red-500/20">• Daily Revenue Ceiling: ~₹8,000 / day</li>
          </ul>
        </div>
        <div class="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
          <h3 class="text-lg font-bold text-emerald-400 mb-3">WITH FOODLINE CAMPUS</h3>
          <ul class="space-y-2 text-sm text-white">
            <li>• 450 to 600+ orders fulfilled per break!</li>
            <li>• Batch pre-cooking based on live 10-min break countdown</li>
            <li>• Express counter hands over meals in <30 seconds</li>
            <li>• 0% student turnbacks — every student gets served</li>
            <li class="font-bold text-emerald-400 pt-2 border-t border-emerald-500/30">• Daily Revenue Potential: ₹35,000+ / day!</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- SLIDE 5: Profit Pillar 2 -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Canteen Profit Pillar #2</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">12-Digit Instant UTR Verification — 100% Payment Security</h2>

      <div class="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xl">🔒</div>
          <div>
            <h3 class="text-lg font-bold text-white">Automatic 12-Digit UTR Replay Protection</h3>
            <p class="text-sm text-zinc-300">Every UPI transaction reference is verified before the order reaches your kitchen screen. Zero fake screenshots, zero double-claims.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xl">💳</div>
          <div>
            <h3 class="text-lg font-bold text-white">100% Upfront Canteen Direct Payments</h3>
            <p class="text-sm text-zinc-300">Payments land directly in your canteen bank account upfront before food is prepared. No cash handling or unpaid orders.</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xl">📊</div>
          <div>
            <h3 class="text-lg font-bold text-white">Live Canteen Sales Ledger</h3>
            <p class="text-sm text-zinc-300">View real-time dish breakdown, revenue totals, and sales analytics directly on your mobile phone or tablet dashboard.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 6: Profit Pillar 3 -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Canteen Profit Pillar #3</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">Smart Pre-Order Inventory — Cut Food Waste by 80%</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-black/40 border border-white/10">
          <h3 class="text-lg font-bold text-amber-400 mb-3">🎯 Exact Demand Forecasting</h3>
          <p class="text-sm text-zinc-300 mb-4">No more guessing how many Samosas, Misal Pav, or Sandwiches to prepare. Your KDS shows exact quantities pre-ordered 15 minutes in advance.</p>
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono">
            Chef Target: Prep 120 Vada Pav & 80 Cold Coffees
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-black/40 border border-emerald-500/30">
          <h3 class="text-lg font-bold text-emerald-400 mb-3">💰 Boost Net Monthly Profit Margins</h3>
          <p class="text-sm text-zinc-300 mb-4">Eliminating unsold food wastage directly adds 5% to 8% to your canteen's net profit margin. Pre-order combos increase average order value by +30%.</p>
          <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-mono">
            Basket Growth: ₹45 Average Order ➔ ₹65 Combo Order
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 7: Kitchen Display System -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Free Canteen Automation</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">Kitchen Display System (KDS) — Built for Fast Kitchens</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-5 rounded-2xl bg-black/40 border border-white/10">
          <div class="text-xl mb-1">📱</div>
          <h3 class="font-bold text-white mb-1">1-Tap Order Status Updates</h3>
          <p class="text-xs text-zinc-400">Tap "PREPARING" ➔ "READY" ➔ "DISPATCHED". Student receives instant app alert.</p>
        </div>
        <div class="p-5 rounded-2xl bg-black/40 border border-white/10">
          <div class="text-xl mb-1">🔊</div>
          <h3 class="font-bold text-white mb-1">Soundbox & Audio Chime Alerts</h3>
          <p class="text-xs text-zinc-400">Optional audio chime alerts kitchen staff when new pre-orders arrive during rush hour.</p>
        </div>
        <div class="p-5 rounded-2xl bg-black/40 border border-white/10">
          <div class="text-xl mb-1">📊</div>
          <h3 class="font-bold text-white mb-1">Dish Prep Mode</h3>
          <p class="text-xs text-zinc-400">Aggregates all active pre-orders so your cook knows exact batch quantities.</p>
        </div>
        <div class="p-5 rounded-2xl bg-black/40 border border-white/10">
          <div class="text-xl mb-1">⚡</div>
          <h3 class="font-bold text-white mb-1">No Paper Tokens Needed</h3>
          <p class="text-xs text-zinc-400">Go 100% digital. Student shows optical QR pass on phone for 2-second scan verification.</p>
        </div>
      </div>
    </div>

    <!-- SLIDE 8: Canteen Financial Table -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Canteen Financial Projections</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-4">Estimated Monthly Canteen Revenue & Net Profit Comparison</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr class="border-b border-white/10">
              <th class="p-3 text-emerald-400 font-bold">Business Metric</th>
              <th class="p-3 text-zinc-400 font-bold">Traditional Counter</th>
              <th class="p-3 text-white font-bold bg-emerald-500/10">With FoodLine Campus</th>
              <th class="p-3 text-emerald-400 font-bold bg-emerald-500/20">Canteen Net Profit Gain</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr>
              <td class="p-3 font-bold text-white">Daily Break Meals Served</td>
              <td class="p-3 text-zinc-400">180 Meals</td>
              <td class="p-3 text-white font-bold bg-emerald-500/5">550 Meals</td>
              <td class="p-3 text-emerald-400 font-bold bg-emerald-500/10">+370 Meals / Day</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Average Order Value (AOV)</td>
              <td class="p-3 text-zinc-400">₹45 / Meal</td>
              <td class="p-3 text-white font-bold bg-emerald-500/5">₹65 (Combos)</td>
              <td class="p-3 text-emerald-400 font-bold bg-emerald-500/10">+₹20 Basket Growth</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Daily Canteen Revenue</td>
              <td class="p-3 text-zinc-400">₹8,100 / Day</td>
              <td class="p-3 text-white font-bold bg-emerald-500/5">₹35,750 / Day</td>
              <td class="p-3 text-emerald-400 font-bold bg-emerald-500/10">+₹27,650 / Day Revenue</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Monthly Canteen Revenue (22 Days)</td>
              <td class="p-3 text-zinc-400">₹1.78 Lakhs / Mo</td>
              <td class="p-3 text-white font-bold bg-emerald-500/5">₹7.86 Lakhs / Mo</td>
              <td class="p-3 text-emerald-400 font-bold bg-emerald-500/10">+₹6.08 Lakhs / Month</td>
            </tr>
            <tr class="bg-emerald-500/20 font-black text-white">
              <td class="p-3 text-emerald-300">Est. Net Monthly Profit</td>
              <td class="p-3 text-zinc-300">₹44,500 / Month</td>
              <td class="p-3 text-emerald-200">₹1,96,500 / Month</td>
              <td class="p-3 text-emerald-400">+₹1,52,000 Net Profit / Month</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SLIDE 9: Easy Setup -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Easy 10-Minute Onboarding</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-6">Zero Upfront Cost • Zero Hardware Purchase • Zero Risk</h2>

      <div class="space-y-3">
        <div class="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 w-24">STEP 1</span>
          <span class="font-bold text-white w-48">Free Menu Digitization</span>
          <span class="text-xs text-zinc-400 flex-1">We upload your complete canteen menu, dish photos, prices, and categories into FoodLine.</span>
        </div>
        <div class="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 w-24">STEP 2</span>
          <span class="font-bold text-white w-48">Any Phone or Tablet</span>
          <span class="text-xs text-zinc-400 flex-1">Use your existing Android phone or canteen tablet. No expensive machines needed.</span>
        </div>
        <div class="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 w-24">STEP 3</span>
          <span class="font-bold text-white w-48">10-Min Kitchen Training</span>
          <span class="text-xs text-zinc-400 flex-1">Our operational team trains your canteen staff on 1-tap order updates on-site.</span>
        </div>
        <div class="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 w-24">STEP 4</span>
          <span class="font-bold text-white w-48">7-Day Risk-Free Trial</span>
          <span class="text-xs text-zinc-400 flex-1">Test FoodLine in your canteen with zero commitment. See the sales jump yourself!</span>
        </div>
      </div>
    </div>

    <!-- SLIDE 10: Call To Action -->
    <div class="slide flex-col w-full glass-card rounded-3xl p-8 md:p-12 border-2 border-emerald-500/40 glow-green">
      <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Partner With Us</div>
      <h2 class="text-2xl md:text-4xl font-black text-white mb-4">Let's Partner to Grow Your Canteen Business Today!</h2>
      <p class="text-base text-zinc-300 mb-6">
        Start serving 3x more students with zero queue chaos, zero unpaid orders, and higher monthly net profit.
      </p>

      <div class="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3 mb-6">
        <div class="text-sm font-bold text-emerald-400">📞 Contact Operations Team For Immediate Onboarding:</div>
        <div class="text-base font-bold text-white">Shivam Nirmal — Founder & Operations Lead | FoodLine Campus</div>
        <div class="text-xs text-zinc-300 font-mono">
          Phone: +91 99600 91371 &nbsp;|&nbsp; Email: support@foodlinecampus.in &nbsp;|&nbsp; Portal: https://foodline-campus.vercel.app
        </div>
      </div>
    </div>

  </main>

  <!-- BOTTOM CONTROLS & NAVIGATION -->
  <footer class="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-t border-white/10 mt-4">
    <button id="prev-btn" onclick="prevSlide()" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition cursor-pointer disabled:opacity-30">
      ← Previous
    </button>

    <div class="flex items-center gap-1.5" id="dots-container">
      <!-- Dots injected dynamically -->
    </div>

    <button id="next-btn" onclick="nextSlide()" className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20">
      Next →
    </button>
  </footer>

  <script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const slideNum = document.getElementById('slide-num');
    const dotsContainer = document.getElementById('dots-container');

    // Generate dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = \`w-2.5 h-2.5 rounded-full transition-all cursor-pointer \${i === 0 ? 'bg-emerald-400 w-6' : 'bg-zinc-700'}\`;
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }

    function updateSlide() {
      slides.forEach((s, idx) => {
        if (idx === currentSlide) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
      slideNum.textContent = currentSlide + 1;

      // Update dots
      const dots = dotsContainer.children;
      for (let i = 0; i < dots.length; i++) {
        if (i === currentSlide) {
          dots[i].className = 'w-6 h-2.5 rounded-full bg-emerald-400 transition-all cursor-pointer';
        } else {
          dots[i].className = 'w-2.5 h-2.5 rounded-full bg-zinc-700 transition-all cursor-pointer';
        }
      }

      document.getElementById('prev-btn').disabled = currentSlide === 0;
      if (currentSlide === totalSlides - 1) {
        document.getElementById('next-btn').textContent = 'Finish ✓';
      } else {
        document.getElementById('next-btn').textContent = 'Next →';
      }
    }

    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
      }
    }

    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
      }
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlide();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    });

    updateSlide();
  </script>
</body>
</html>
`;

// Save in root and in frontend/public/
const rootPath = '/run/media/darkkakashi/PC NVME/StartUp Project (FOODLINE CAMPUS)/PPT OTHER TASKES/FoodLine_Canteen_Manager_Pitch.html';
const publicPath = '/run/media/darkkakashi/PC NVME/StartUp Project (FOODLINE CAMPUS)/PPT OTHER TASKES/frontend/public/canteen-pitch.html';

fs.writeFileSync(rootPath, htmlContent);
fs.writeFileSync(publicPath, htmlContent);

console.log('✅ HTML Pitch Presentation saved successfully at:');
console.log('  1. ' + rootPath);
console.log('  2. ' + publicPath);
