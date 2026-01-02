// ============================================
// PARTICLES CANVAS ANIMATION
// ============================================

class ParticlesAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousemove', (event) => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;

            this.particles.push(new Particle(x, y, speedX, speedY, size, this.ctx));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height);
            particle.draw();

            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;

                    particle.x -= directionX * force * 3;
                    particle.y -= directionY * force * 3;
                }
            }
        });

        // Connect particles
        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 1 - (distance / 120);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(x, y, speedX, speedY, size, ctx) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = size;
        this.ctx = ctx;

        // Gradient colors
        this.colors = [
            'rgba(99, 102, 241, 0.8)',   // Primary
            'rgba(139, 92, 246, 0.8)',   // Secondary
            'rgba(236, 72, 153, 0.8)'    // Tertiary
        ];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvasWidth || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvasHeight || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticlesAnimation('particlesCanvas');
    });
} else {
    new ParticlesAnimation('particlesCanvas');
}
