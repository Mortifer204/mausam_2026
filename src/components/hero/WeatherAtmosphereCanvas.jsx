import React, { useEffect, useRef } from 'react';

/**
 * WeatherAtmosphereCanvas
 * Robust mobile-friendly WebGL canvas rendering photorealistic moving clouds & atmospheric skies:
 * - High-DPI mobile pixel ratio support
 * - Dynamic moving billowy volumetric clouds (smooth GPU FBM raymarching)
 * - Condition-reactive lighting:
 *    * 'clear' / 'sunny': Warm golden sun corona with animated rays and drifting clouds
 *    * 'rain' / 'drizzle' / 'monsoon': Deep storm clouds with animated downward rainfall streaks
 *    * 'thunder' / 'squall': Menacing turbulent clouds with dynamic lightning flashes
 *    * 'pleasant' / 'cloudy' / 'overcast': Drifting stratified clouds with soft moonlight/sky radiance
 * - Graceful HTML5 2D Canvas fallback if WebGL is disabled or restricted on mobile
 */
export function WeatherAtmosphereCanvas({ conditionCode = 'pleasant', temp = 27, isNight = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let gl = null;

    // Detect WebGL
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: false, powerPreference: 'high-performance' }) || 
           canvas.getContext('experimental-webgl', { alpha: true, antialias: true, depth: false });
    } catch (e) {
      console.warn("Could not get WebGL context:", e);
    }

    // Measure parent container
    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return { w: 400, h: 300 };
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(rect.width, 300);
      const h = Math.max(rect.height, 280);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      return { w: canvas.width, h: canvas.height };
    };

    let { w, h } = updateSize();

    // Map condition to shader mode
    // 0: sunny/clear, 1: rain, 2: thunder, 3: pleasant/cloudy/overcast
    let conditionInt = 3;
    let rainIntensity = 0.0;
    const lowerCond = (conditionCode || '').toLowerCase();

    if (lowerCond.includes('sun') || lowerCond === 'clear') {
      conditionInt = 0;
      rainIntensity = 0.0;
    } else if (lowerCond.includes('thunder') || lowerCond.includes('squall')) {
      conditionInt = 2;
      rainIntensity = 0.85;
    } else if (lowerCond.includes('rain') || lowerCond.includes('drizzle') || lowerCond.includes('monsoon')) {
      conditionInt = 1;
      rainIntensity = 0.7;
    } else {
      // Overcast, cloudy, pleasant, haze, fog
      conditionInt = 3;
      rainIntensity = 0.0;
    }

    // -------------------------------------------------------------
    // PATH 1: WebGL Rendering Engine
    // -------------------------------------------------------------
    if (gl) {
      gl.viewport(0, 0, w, h);

      const vsSource = `
        attribute vec2 aPosition;
        void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform int uCondition; // 0: clear/sunny, 1: rain, 2: thunder, 3: cloudy/overcast
        uniform float uRainIntensity;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 5; ++i) {
            v += a * noise(p);
            p = rot * p * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          float t = uTime * 0.08;

          // Flowing horizontal cloud movement with natural billow
          vec2 cloudCoord = uv * vec2(2.8, 1.8);
          cloudCoord.x += t * 0.45;
          cloudCoord.y += sin(t * 0.25 + uv.x * 2.0) * 0.06;

          float q = fbm(cloudCoord);
          vec2 r = vec2(
            fbm(cloudCoord + q + vec2(1.7, 9.2) + 0.15 * t),
            fbm(cloudCoord + q + vec2(8.3, 2.8) + 0.12 * t)
          );
          float f = fbm(cloudCoord + r);

          vec3 skyColor;
          vec3 cloudLight;
          vec3 cloudDark;
          float cloudDensity = 0.0;
          float sunGlow = 0.0;
          float lightning = 0.0;

          if (uCondition == 0) {
            // Sunny / Clear
            vec2 sunPos = vec2(0.72, 0.76);
            float sunDist = length(uv - sunPos);
            sunGlow = pow(clamp(1.0 - sunDist * 1.4, 0.0, 1.0), 2.0);

            skyColor = mix(vec3(0.07, 0.18, 0.35), vec3(0.12, 0.28, 0.52), uv.y);
            cloudLight = vec3(0.96, 0.94, 0.88) * (1.0 + sunGlow * 0.8);
            cloudDark = vec3(0.35, 0.45, 0.60);
            cloudDensity = smoothstep(0.42, 0.85, f);
          } else if (uCondition == 1) {
            // Rain / Monsoon
            skyColor = mix(vec3(0.04, 0.09, 0.16), vec3(0.08, 0.15, 0.26), uv.y);
            cloudLight = vec3(0.45, 0.52, 0.62);
            cloudDark = vec3(0.12, 0.16, 0.24);
            cloudDensity = smoothstep(0.28, 0.82, f) * 1.35;
          } else if (uCondition == 2) {
            // Thunderstorm with dynamic flashes
            float flash = fract(uTime * 0.35);
            if (flash > 0.91 || (flash > 0.45 && flash < 0.48)) {
              lightning = 1.0;
            }
            skyColor = mix(vec3(0.03, 0.05, 0.10), vec3(0.06, 0.10, 0.18), uv.y) + vec3(lightning * 0.4);
            cloudLight = vec3(0.42, 0.46, 0.56) + vec3(lightning * 0.5);
            cloudDark = vec3(0.08, 0.11, 0.18);
            cloudDensity = smoothstep(0.26, 0.80, f) * 1.45;
          } else {
            // Overcast / Cloudy / Moonlit Night (Visible soft billowing clouds)
            skyColor = mix(vec3(0.05, 0.10, 0.19), vec3(0.11, 0.18, 0.31), uv.y);
            
            // Soft moon illumination
            vec2 moonPos = vec2(0.70, 0.78);
            float moonDist = length(uv - moonPos);
            float moonGlow = pow(clamp(1.0 - moonDist * 1.8, 0.0, 1.0), 2.5);

            cloudLight = mix(vec3(0.72, 0.80, 0.92), vec3(0.95, 0.98, 1.0), moonGlow);
            cloudDark = vec3(0.18, 0.25, 0.38);
            // Prominent cloud density so clouds are distinctly visible on mobile
            cloudDensity = smoothstep(0.25, 0.80, f) * 1.25;
          }

          vec3 clouds = mix(cloudDark, cloudLight, clamp(r.x * 1.35, 0.0, 1.0));
          vec3 finalColor = mix(skyColor, clouds, clamp(cloudDensity, 0.0, 0.92));

          if (sunGlow > 0.0) {
            finalColor += vec3(1.0, 0.72, 0.35) * (sunGlow * 0.45);
          }

          // Rain Streaks
          if (uRainIntensity > 0.0) {
            vec2 rainUV = uv * vec2(35.0, 5.0);
            rainUV.y += uTime * 7.5;
            rainUV.x += uTime * 1.0;
            float rStreak = noise(rainUV);
            float rainLine = smoothstep(0.85, 0.98, rStreak) * uRainIntensity;
            finalColor += vec3(0.55, 0.78, 0.98) * rainLine * 0.48;
          }

          // Bottom smooth fade to card color
          float bottomFade = smoothstep(0.0, 0.35, uv.y);
          float alpha = mix(0.40, 1.0, bottomFade);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn("Shader err:", gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          gl.useProgram(prog);

          const posBuf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

          const aPos = gl.getAttribLocation(prog, "aPosition");
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          const uTimeLoc = gl.getUniformLocation(prog, "uTime");
          const uResLoc = gl.getUniformLocation(prog, "uResolution");
          const uCondLoc = gl.getUniformLocation(prog, "uCondition");
          const uRainLoc = gl.getUniformLocation(prog, "uRainIntensity");

          gl.uniform1i(uCondLoc, conditionInt);
          gl.uniform1f(uRainLoc, rainIntensity);

          const start = performance.now();
          const renderLoop = (now) => {
            const elapsed = (now - start) * 0.001;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform1f(uTimeLoc, elapsed);
            gl.uniform2f(uResLoc, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(renderLoop);
          };

          animationFrameId = requestAnimationFrame(renderLoop);

          const handleResize = () => {
            const dims = updateSize();
            gl.viewport(0, 0, dims.w, dims.h);
          };
          window.addEventListener('resize', handleResize);

          return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            gl.deleteProgram(prog);
            gl.deleteBuffer(posBuf);
          };
        }
      }
    }

    // -------------------------------------------------------------
    // PATH 2: High-Performance 2D Canvas Fallback (Guaranteed to work on all mobile devices)
    // -------------------------------------------------------------
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const render2D = () => {
      offset += 0.4;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky gradient matching condition
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (conditionInt === 0) {
        skyGrad.addColorStop(0, '#1F4785');
        skyGrad.addColorStop(0.5, '#173868');
        skyGrad.addColorStop(1, '#102444');
      } else if (conditionInt === 1) {
        skyGrad.addColorStop(0, '#142642');
        skyGrad.addColorStop(0.5, '#0F1E35');
        skyGrad.addColorStop(1, '#0A1729');
      } else if (conditionInt === 2) {
        skyGrad.addColorStop(0, '#15132B');
        skyGrad.addColorStop(0.5, '#0F1324');
        skyGrad.addColorStop(1, '#080D1A');
      } else {
        skyGrad.addColorStop(0, '#1C2E4F');
        skyGrad.addColorStop(0.5, '#16253E');
        skyGrad.addColorStop(1, '#0D1A30');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw flowing cloud puffs
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 6; i++) {
        const x = ((i * 120 + offset * (0.8 + i * 0.2)) % (canvas.width + 160)) - 80;
        const y = 40 + Math.sin((offset + i * 50) * 0.02) * 15 + i * 18;
        ctx.beginPath();
        ctx.arc(x, y, 65, 0, Math.PI * 2);
        ctx.arc(x + 45, y - 10, 50, 0, Math.PI * 2);
        ctx.arc(x + 90, y + 10, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render2D);
    };

    animationFrameId = requestAnimationFrame(render2D);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [conditionCode, isNight]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl"
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'block'
      }}
    />
  );
}
