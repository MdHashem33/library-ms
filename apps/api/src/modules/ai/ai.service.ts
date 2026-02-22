import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../database/prisma.service';
import { GenerateSummaryDto } from './dto/summary.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateBookSummary(dto: GenerateSummaryDto) {
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const prompt = `Generate a concise, engaging 2-3 paragraph summary for the following book:

Title: ${book.title}
Author: ${book.author}
${book.genre?.length ? `Genre: ${book.genre.join(', ')}` : ''}
${book.publisher ? `Publisher: ${book.publisher}` : ''}
${book.publishedAt ? `Published: ${new Date(book.publishedAt).getFullYear()}` : ''}

Write a description that would help a library patron decide whether to borrow this book.
Focus on what the book is about, its significance, and who would enjoy reading it.
Keep the tone informative but engaging.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional librarian and book reviewer. Generate accurate, helpful book descriptions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const summary = completion.choices[0]?.message?.content;
      if (!summary) throw new InternalServerErrorException('Failed to generate summary');

      // Save summary to book description
      const updatedBook = await this.prisma.book.update({
        where: { id: dto.bookId },
        data: { description: summary },
      });

      return {
        book: updatedBook,
        summary,
        tokensUsed: completion.usage?.total_tokens,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(`OpenAI API error: ${error.message}`);
    }
  }
}
