'use client';

import { Theme } from '@/types/kanban';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  colorful: Sparkles,
};

const themeLabels = {
  light: 'Light',
  dark: 'Dark',
  colorful: 'Colorful',
};

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const CurrentIcon = themeIcons[currentTheme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          {themeLabels[currentTheme]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(themeIcons) as Theme[]).map((theme) => {
          const Icon = themeIcons[theme];
          return (
            <DropdownMenuItem
              key={theme}
              onClick={() => onThemeChange(theme)}
              className={currentTheme === theme ? 'bg-accent' : ''}
            >
              <Icon className="mr-2 h-4 w-4" />
              {themeLabels[theme]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
