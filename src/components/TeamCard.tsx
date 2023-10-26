import { TeamTheme } from "@/util/teamThemes";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

/** The props for the TeamCard */
export interface TeamCardProps {
  /** The team name */
  name: string,
  /** The team logo image */
  image: string | StaticImport,
  /** The number of wins to display */
  wins: number,
  /** The number of losses to display */
  losses: number,
  /** The score to display */
  score: number,
  /** The team color theme */
  theme: TeamTheme,
}

export default function TeamCard({
  name, image, wins, losses, score, 
  theme,
  
}: TeamCardProps) {
  return (<div className="card shadow-xl">
  <div 
    className="p-2 rounded-t-xl"
    style={{ 
      backgroundColor: theme.primaryColor, 
  }}>
    <figure 
      style={{ 
        height: 200, 
        width: 'auto',
        position: 'relative' 
      }}>
      <Image 
        src={image} 
        alt={name} 
        fill 
        priority
        sizes="200px"
        style={{
          objectFit: 'contain'
        }}
      />
      </figure>
    </div>
  <div 
  className={`card-body rounded-b-xl ${theme.secondaryText === 'black' ? 'text-black':'text-white'}`} 
  style={{ backgroundColor: theme.secondaryColor}}>
    <div className="w-full text-center text-3xl">{name}</div>
    <div className="w-full text-center text-3xl">W {wins} - {losses} L</div>
    <div className="w-full text-center text-3xl">{score} pts</div>
  </div>
</div>);
}