import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Star, MessageCircle, Users, Search, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { sanitizeString, searchSchema } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const TutorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterTimezone, setFilterTimezone] = useState("all");
  const [searchError, setSearchError] = useState("");
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const { toast } = useToast();

  useEffect(() => {
    fetchTutors();
    
    // Set up real-time subscription for tutors
    const channel = supabase
      .channel('tutors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tutors'
        },
        () => {
          fetchTutors(); // Refetch when tutors change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .order('name');

      if (error) throw error;
      setTutors(data || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast({
        title: "Error",
        description: "Failed to load tutors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    const sanitizedValue = sanitizeString(value);
    try {
      searchSchema.parse({ query: sanitizedValue });
      setSearchTerm(sanitizedValue);
      setSearchError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setSearchError(error.issues[0]?.message || "Invalid search query");
      }
    }
  };


  const specialties = [...new Set(tutors
    .map(tutor => tutor.specialty)
    .filter(specialty => specialty && specialty.trim() !== '')
  )];

  const timezones = [...new Set(tutors
    .map(tutor => tutor.timezone || 'UTC')
    .filter(timezone => timezone && timezone.trim() !== '')
  )].sort();

  const handleConnectTutor = (tutorName: string, available: boolean) => {
    if (available) {
      // Scroll to form and set tutor selection
      const formElement = document.querySelector('#tutoring-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
        // Trigger custom event to set selected tutor
        const event = new CustomEvent('selectTutor', { 
          detail: { tutorName, formType: 'student' } 
        });
        window.dispatchEvent(event);
      }
    } else {
      toast({
        title: "Tutor Currently Full",
        description: `${tutorName} is not taking new students right now. Try again later!`,
        variant: "destructive",
      });
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filterSpecialty === "all" || tutor.specialty === filterSpecialty;
    const matchesTimezone = filterTimezone === "all" || (tutor.timezone || 'UTC') === filterTimezone;
    return matchesSearch && matchesSpecialty && matchesTimezone;
  });

  // Pagination calculations
  const totalTutors = filteredTutors.length;
  const totalPages = Math.ceil(totalTutors / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTutors = filteredTutors.slice(startIndex, endIndex);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSpecialty, filterTimezone]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of tutors section
    document.getElementById('tutors')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tutors" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Find Your Tutor</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Connect with Amazing Student Tutors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our high school tutors are passionate about sharing their knowledge and helping 
            younger students discover the excitement of engineering.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutors by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              maxLength={100}
            />
            {searchError && <p className="text-sm text-destructive mt-1">{searchError}</p>}
          </div>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTimezone} onValueChange={setFilterTimezone}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timezones</SelectItem>
              {timezones.map(timezone => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="18">18 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        {!loading && filteredTutors.length > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalTutors)} of {totalTutors} tutors
            </p>
          </div>
        )}

        {/* Tutors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading tutors...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentTutors.map((tutor) => (
            <Card key={tutor.id} className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
              {/* Header with availability indicator */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-hero-gradient rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{tutor.name}</h3>
                      <p className="text-xs text-muted-foreground">{tutor.school}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${tutor.availability ? "bg-secondary" : "bg-muted"}`}></div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Quick stats bar */}
                <div className="flex items-center justify-between mb-3 p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-accent fill-current" />
                    <span className="font-medium">{tutor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3 text-secondary" />
                    <span>{tutor.students}</span>
                  </div>
                </div>

                {/* Specialty and timezone */}
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{tutor.specialty}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{tutor.timezone || "UTC"}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {tutor.bio}
                </p>

                {/* Skills tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {tutor.skills
                      .filter(skill => skill && skill.trim() !== '')
                      .map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs" 
                    variant={tutor.availability ? "default" : "outline"}
                    onClick={() => handleConnectTutor(tutor.name, tutor.availability)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {tutor.availability ? "Connect" : "Full"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredTutors.length > 0 && totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="gap-1 pl-2.5"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                </PaginationItem>
                
                {(() => {
                  // If 7 or fewer pages, show all numbers
                  if (totalPages <= 7) {
                    return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <Button
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    ));
                  }
                  
                  // For more than 7 pages, use smart ellipsis
                  const pages = [];
                  
                  // Always show first page
                  pages.push(
                    <PaginationItem key={1}>
                      <Button
                        variant={currentPage === 1 ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="w-9 h-9 p-0"
                      >
                        1
                      </Button>
                    </PaginationItem>
                  );
                  
                  // Show ellipsis after first page if current page is far from start
                  if (currentPage > 3) {
                    pages.push(
                      <PaginationItem key="ellipsis-start">
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  
                  // Show pages around current page
                  const startPage = Math.max(2, currentPage - 1);
                  const endPage = Math.min(totalPages - 1, currentPage + 1);
                  
                  for (let page = startPage; page <= endPage; page++) {
                    pages.push(
                      <PaginationItem key={page}>
                        <Button
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    );
                  }
                  
                  // Show ellipsis before last page if current page is far from end
                  if (currentPage < totalPages - 2) {
                    pages.push(
                      <PaginationItem key="ellipsis-end">
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    );
                  }
                  
                  // Always show last page
                  pages.push(
                    <PaginationItem key={totalPages}>
                      <Button
                        variant={currentPage === totalPages ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="w-9 h-9 p-0"
                      >
                        {totalPages}
                      </Button>
                    </PaginationItem>
                  );
                  
                  return pages;
                })()}
                
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1 pr-2.5"
                  >
                    Next
                    <span className="sr-only">Next</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {!loading && filteredTutors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No tutors found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TutorDirectory;