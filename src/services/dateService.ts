
import { ISODateString } from '@/types/dates';

/**
 * Serviço centralizado para manipulação de datas e conversões
 */
export const dateService = {
  /**
   * Converte uma string ISO ou objeto Date para um objeto Date
   * @returns Date objeto ou null se inválido
   */
  parseDate(date: Date | ISODateString | null | undefined): Date | null {
    if (!date) return null;
    
    try {
      // Se já for um Date, verificamos se é válido
      if (date instanceof Date) {
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Se for string, tentamos converter para Date
      if (typeof date === 'string') {
        // Tenta padrão ISO primeiro
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
        
        // Tenta formatos alternativos (DD/MM/YYYY)
        if (date.includes('/')) {
          const parts = date.split(/[\/\-\s:]/);
          if (parts.length >= 3) {
            // Nota: mês é 0-indexado no JS Date
            const newDate = new Date(
              parseInt(parts[2]), // Ano
              parseInt(parts[1]) - 1, // Mês
              parseInt(parts[0]) // Dia
            );
            if (!isNaN(newDate.getTime())) {
              return newDate;
            }
          }
        }
      }
      
      // Se chegou aqui, não conseguimos obter um Date válido
      console.warn('Data inválida:', date);
      return null;
    } catch (error) {
      console.error('Erro ao analisar data:', error);
      return null;
    }
  },
  
  /**
   * Converte uma data para string ISO para armazenamento ou API
   * @returns String ISO ou null
   */
  toISOString(date: Date | ISODateString | null | undefined): ISODateString | null {
    if (!date) return null;
    
    try {
      // Se já for string, verifica se está em formato ISO
      if (typeof date === 'string') {
        // Tenta converter para Date e depois de volta para ISO para validar
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null;
      }
      
      // Se for Date, converte para ISO
      return date.toISOString();
    } catch (error) {
      console.error('Erro ao converter para ISO:', error);
      return null;
    }
  },
  
  /**
   * Formata uma data para exibição no input datetime-local
   */
  formatForDateTimeInput(date: Date | ISODateString | null | undefined): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      
      if (!parsedDate) return '';
      
      // Ajustar para o fuso horário local (para inputs datetime-local)
      const localDate = new Date(parsedDate.getTime() - (parsedDate.getTimezoneOffset() * 60000));
      return localDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Erro formatando data para input:', error);
      return '';
    }
  },
  
  /**
   * Formata uma data para exibição na interface do usuário (formato brasileiro)
   */
  formatForDisplay(date: Date | ISODateString | null | undefined, includeTime: boolean = true): string {
    if (!date) return '';
    
    try {
      const parsedDate = this.parseDate(date);
      if (!parsedDate) return '';
      
      const day = parsedDate.getDate().toString().padStart(2, '0');
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = parsedDate.getFullYear();
      
      let result = `${day}/${month}/${year}`;
      
      if (includeTime) {
        const hours = parsedDate.getHours().toString().padStart(2, '0');
        const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
        result += ` ${hours}:${minutes}`;
      }
      
      return result;
      
    } catch (error) {
      console.error('Erro formatando data para exibição:', error);
      return '';
    }
  },
  
  /**
   * Converte os campos de data de DTO para formato interno (Date)
   */
  fromDTO(dto: Partial<any>): Partial<any> {
    return {
      ...(dto.ideal_date !== undefined && { idealDate: this.parseDate(dto.ideal_date) }),
      ...(dto.created_at !== undefined && { createdAt: this.parseDate(dto.created_at) || new Date() }),
      ...(dto.completed_at !== undefined && { completedAt: this.parseDate(dto.completed_at) })
    };
  },
  
  /**
   * Converte os campos de data do formato interno (Date) para DTO
   */
  toDTO(fields: Partial<any>): Partial<any> {
    return {
      ...(fields.idealDate !== undefined && { ideal_date: this.toISOString(fields.idealDate) }),
      ...(fields.createdAt !== undefined && { created_at: this.toISOString(fields.createdAt) || new Date().toISOString() }),
      ...(fields.completedAt !== undefined && { completed_at: this.toISOString(fields.completedAt) })
    };
  },
  
  /**
   * Verifica se uma tarefa está vencida (antes da data/hora atual)
   */
  isTaskOverdue(date: Date | string | null): boolean {
    if (!date) return false;
    
    try {
      const dateToCompare = this.parseDate(date);
      
      if (!dateToCompare) {
        return false;
      }
      
      return dateToCompare < new Date();
    } catch (error) {
      console.error('Erro ao verificar se tarefa está vencida:', error);
      return false;
    }
  },
  
  /**
   * Adiciona ou subtrai dias a uma data
   */
  addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  /**
   * Verifica se duas datas são iguais (mesmo dia, mês, ano)
   */
  isSameDate(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
    if (!date1 || !date2) return false;
    
    const parsed1 = this.parseDate(date1);
    const parsed2 = this.parseDate(date2);
    
    if (!parsed1 || !parsed2) return false;
    
    return (
      parsed1.getDate() === parsed2.getDate() &&
      parsed1.getMonth() === parsed2.getMonth() &&
      parsed1.getFullYear() === parsed2.getFullYear()
    );
  }
};
