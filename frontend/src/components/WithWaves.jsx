import GradientWaves from './GradientWaves/GradientWaves.jsx'
import './WithWaves.css'

export default function WithWaves({ children }) {
  return (
    <div className="with-waves-wrap">
      <div className="with-waves-bg">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>
      <div className="with-waves-content">{children}</div>
    </div>
  )
}
