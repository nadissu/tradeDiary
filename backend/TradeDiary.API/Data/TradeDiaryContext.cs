using Microsoft.EntityFrameworkCore;
using TradeDiary.API.Models;

namespace TradeDiary.API.Data;

public class TradeDiaryContext : DbContext
{
    public TradeDiaryContext(DbContextOptions<TradeDiaryContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Trade> Trades => Set<Trade>();
    public DbSet<Strategy> Strategies => Set<Strategy>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        // Trade configuration
        modelBuilder.Entity<Trade>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Coin).IsRequired().HasMaxLength(20);
            entity.Property(e => e.EntryPrice).HasPrecision(18, 8);
            entity.Property(e => e.ExitPrice).HasPrecision(18, 8);
            entity.Property(e => e.PositionSize).HasPrecision(18, 8);
            entity.Property(e => e.PnL).HasPrecision(18, 8);
            entity.Property(e => e.PnLPercent).HasPrecision(10, 4);
            entity.Property(e => e.Timeframe).HasMaxLength(10);
            entity.Property(e => e.Strategy).HasMaxLength(100);
            entity.Property(e => e.BotName).HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Trades)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Strategy configuration
        modelBuilder.Entity<Strategy>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Strategies)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
