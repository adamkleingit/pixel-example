import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { ThemeSettings } from "@kanban/shared";

@Entity("settings")
export class SettingsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "simple-json" })
  theme!: ThemeSettings;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
